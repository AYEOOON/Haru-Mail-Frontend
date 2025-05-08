import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Image from '@editorjs/image';

export let editor: EditorJS | null = null; // 에디터 인스턴스 (전역 참조용)
let isInitializing = false; // 중복 초기화를 방지하기 위한 플래그

// 에디터 초기화
export const initializeViewer = (holder: HTMLElement, savedJson: any) => {
    if (editor || isInitializing) return;

    console.log("tsx에서 받아온 데이터:", savedJson); // 디버깅용

    console.log("initializing...");
    isInitializing = true;

    const instance = new EditorJS({
        holder,
        readOnly: true, // 읽기 전용 모드 설정
        tools: {
            header: Header,
            list: List,
            image: {
                class: Image,
                config: {
                    uploader: {
                        uploadByFile(file: File) {
                            // 클라이언트 측에서만 처리
                            return new Promise((resolve) => {
                                const reader = new FileReader();

                                reader.onload = () => {
                                    resolve({
                                        success: 1,
                                        file: {
                                            url: reader.result,  // Data URL로 파일을 반환
                                        },
                                    });
                                };

                                // 파일을 읽고 Data URL 형식으로 저장
                                reader.readAsDataURL(file);
                            });
                        }
                    }
                }
            },
        },
        autofocus: true,
    });

    instance.isReady.then(() => {
        editor = instance;

        // 에디터가 초기화된 후, savedJson이 있으면 렌더링
        if (savedJson) {
            editor.render(savedJson).then(() => {
                console.log("Viewer data rendered successfully");
            }).catch((error) => {
                console.error("Rendering data failed:", error);
            });
        }

        isInitializing = false;
        console.log("Viewer initialized!");
    }).catch((error) => {
        console.error("Viewer init failed", error);
        isInitializing = false;
    });
};

// 에디터 제거(메모리 해제)
export const destroyEditor = () => {
    if (editor && typeof editor.destroy === 'function') {
        editor.destroy();
        editor = null;
        console.log("Viewer destroyed");
    }
};