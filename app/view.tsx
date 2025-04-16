import { PanResponder } from 'react-native';
import { DefaultView } from "@/components/commonComponents";
import { useLocalSearchParams } from "expo-router";
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as FileSystem from 'expo-file-system';
import { useEffect, useRef, useState } from "react";
import {Colors, LoaderScreen} from "react-native-ui-lib";
import {ViewErrorContainer, ViewGeneralText, ViewModelContainer} from "@/components/viewComponent";

export const unstable_settings = {
    headerShown: true,
};

function ModelViewer({ uri }: { uri: string }) {
    const [localUri, setLocalUri] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const modelRef = useRef<THREE.Group | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const rendererRef = useRef<Renderer | null>(null);

    const touchState = useRef({
        previousTouch: { x: 0, y: 0 },
        currentTouch: { x: 0, y: 0 },
        scale: 1,
        initialDistance: 0,
        isPinching: false
    }).current;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt) => {
                touchState.previousTouch = {
                    x: evt.nativeEvent.touches[0]?.pageX || 0,
                    y: evt.nativeEvent.touches[0]?.pageY || 0
                };

                if (evt.nativeEvent.touches.length === 2) {
                    const touch1 = evt.nativeEvent.touches[0];
                    const touch2 = evt.nativeEvent.touches[1];
                    touchState.initialDistance = Math.sqrt(
                        Math.pow(touch2.pageX - touch1.pageX, 2) +
                        Math.pow(touch2.pageY - touch1.pageY, 2)
                    );
                    touchState.isPinching = true;
                }
            },
            onPanResponderMove: (evt) => {
                const touches = evt.nativeEvent.touches;
                touchState.currentTouch = {
                    x: touches[0]?.pageX || 0,
                    y: touches[0]?.pageY || 0
                };

                if (touches.length === 1 && !touchState.isPinching) {
                    const deltaX = touchState.currentTouch.x - touchState.previousTouch.x;
                    const deltaY = touchState.currentTouch.y - touchState.previousTouch.y;

                    if (modelRef.current) {
                        modelRef.current.rotation.y += deltaX * 0.01;
                        modelRef.current.rotation.x += deltaY * 0.01;
                    }
                }
                else if (touches.length === 2) {
                    const touch1 = touches[0];
                    const touch2 = touches[1];
                    const currentDistance = Math.sqrt(
                        Math.pow(touch2.pageX - touch1.pageX, 2) +
                        Math.pow(touch2.pageY - touch1.pageY, 2)
                    );

                    const scaleFactor = currentDistance / 200;
                    touchState.scale = Math.max(0.5, Math.min(2, scaleFactor));

                    if (modelRef.current) {
                        modelRef.current.scale.set(touchState.scale, touchState.scale, touchState.scale);
                    }
                }

                touchState.previousTouch = { ...touchState.currentTouch };

                if (sceneRef.current && cameraRef.current && rendererRef.current) {
                    rendererRef.current.render(sceneRef.current, cameraRef.current);
                }
            },
            onPanResponderRelease: () => {
                touchState.isPinching = false;
            },
        })
    ).current;

    useEffect(() => {
        const prepareUri = async () => {
            try {
                setLoading(true);
                let correctedUri = uri;

                if (uri.startsWith('content://')) {
                    correctedUri = await copyFileToLocal(uri);
                }

                const fileInfo = await FileSystem.getInfoAsync(correctedUri);
                if (!fileInfo.exists) {
                    throw new Error('Arquivo não encontrado');
                }

                setLocalUri(correctedUri);
                setError(null);
            } catch (err) {
                console.error('Erro ao preparar URI:', err);
                setError(`Erro ao carregar modelo: ${err}`);
            } finally {
                setLoading(false);
            }
        };

        prepareUri();
    }, [uri]);

    if (loading) return <LoaderScreen size={50} color={Colors.$textPrimary} />;
    if (error) return <ViewErrorContainer><ViewGeneralText>{error}</ViewGeneralText></ViewErrorContainer>;
    if (!localUri) return null;

    return (
        <ViewModelContainer {...panResponder.panHandlers}>
            <GLView
                style={{ flex: 1 }}
                onContextCreate={async (gl) => {
                    const renderer = new Renderer({ gl });
                    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
                    rendererRef.current = renderer;

                    const scene = new THREE.Scene();
                    scene.background = new THREE.Color(0xf0f0f0);
                    sceneRef.current = scene;

                    const camera = new THREE.PerspectiveCamera(75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000);
                    camera.position.z = 3;
                    cameraRef.current = camera;

                    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
                    directionalLight.position.set(1, 1, 1);
                    scene.add(directionalLight);

                    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
                    scene.add(ambientLight);

                    const loader = new GLTFLoader();

                    const originalLoadTexture = (THREE as any).TextureLoader.prototype.load;
                    (THREE as any).TextureLoader.prototype.load = function(url: string, onLoad: Function) {
                        const texture = new THREE.Texture();
                        if (onLoad) onLoad(texture);
                        return texture;
                    };

                    try {
                        const { scene: model } = await loader.loadAsync(localUri, undefined);

                        model.traverse((child) => {
                            if (child instanceof THREE.Mesh) {
                                child.material = new THREE.MeshStandardMaterial({
                                    color: 0x888888,
                                    roughness: 0.7,
                                    metalness: 0.3
                                });
                            }
                        });

                        modelRef.current = model;
                        scene.add(model);

                        const animate = () => {
                            requestAnimationFrame(animate);

                            if (sceneRef.current && cameraRef.current && rendererRef.current) {
                                renderer.render(sceneRef.current, cameraRef.current);
                            }

                            gl.endFrameEXP();
                        };
                        animate();
                    } catch (error) {
                        console.error("Erro ao carregar modelo:", error);
                    } finally {
                        (THREE as any).TextureLoader.prototype.load = originalLoadTexture;
                    }
                }}
            />
        </ViewModelContainer>
    );
}

async function copyFileToLocal(uri: string): Promise<string> {
    try {
        const fileExtension = uri.split('.').pop()?.toLowerCase() || 'glb';
        const localUri = `${FileSystem.cacheDirectory}model_${Date.now()}.${fileExtension}`;

        const uploadResult = await FileSystem.createDownloadResumable(
            uri,
            localUri
        ).downloadAsync();

        if (!uploadResult) {
            throw new Error('Falha no download do arquivo');
        }

        return localUri;
    } catch (error) {
        console.error('Erro detalhado ao copiar arquivo:', error);
        throw new Error(`Não foi possível copiar o arquivo: ${error}`);
    }
}

export default function ViewScreen() {
    const { archive } = useLocalSearchParams();
    const parsedArchive = archive ? JSON.parse(archive as string) : null;

    if (!parsedArchive?.assets?.[0]?.uri) {
        return (
            <DefaultView>
                <ViewGeneralText textColor={Colors.$textDefault}>Nenhum arquivo 3D selecionado</ViewGeneralText>
            </DefaultView>
        );
    }

    return (
        <DefaultView centerItems={true}>
            <ModelViewer uri={parsedArchive.assets[0].uri} />
        </DefaultView>
    );
}
