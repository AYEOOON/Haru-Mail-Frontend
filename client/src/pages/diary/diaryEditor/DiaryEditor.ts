import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Image from '@editorjs/image';

export let editor: EditorJS | null = null; // 에디터 인스턴스 (전역 참조용)
let isInitializing = false; // 중복 초기화를 방지하기 위한 플래그

// 에디터 초기화
export const initializeEditor = (holder: HTMLElement) => {
    if (editor || isInitializing) return; // 이미 초기화 중이거나 완료된 경우 종료

    console.log("initializing...");
    isInitializing = true;

    const instance = new EditorJS({
        holder,
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

    // 에디터가 준비되면 전역 editor에 저장
    instance.isReady.then(() => {
        editor = instance;
        isInitializing = false;
        console.log("Editor initialized!");
    }).catch((error) => {
        console.error("Editor init failed", error);
        isInitializing = false;
    });
};

// 에디터 제거(메모리 해제)
export const destroyEditor = () => {
    if (editor && typeof editor.destroy === 'function') {
        editor.destroy();
        editor = null;
        console.log("Editor destroyed");
    }
};

// 오늘 날짜 포맷팅
export function getFormattedToday(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const date = today.getDate();
    const day = ['일', '월', '화', '수', '목', '금', '토'][today.getDay()];
    return `${year}.${month}.${date} (${day})`;
}

// 일기 저장
export const getEditorData = async () => {
    if (editor) {
        try {
            const data = await editor.save();
            const jsonData = JSON.stringify(data); // JSON 문자열로 변환
            return jsonData;
        } catch (err) {
            console.error("저장 실패:", err);
        }
    }
};

// let imageCache = []; // 이미지를 임시로 저장할 배열
//
// const imageUploader = {
//     async uploadByFile(file) {
//         // 여기서 file을 처리하고, 서버에 업로드 후 URL을 반환
//         console.log(file);  // 파일을 콘솔에 찍어 확인
//         return {
//             success: 1,
//             file: {
//                 url: 'https://via.placeholder.com/150',  // 테스트용 이미지 URL
//             },
//         };
//     },
// };
//
// // 이미지 업로드를 위한 서버 API 호출
// const imageUploader2 = {
//     async uploadByFile(file: File) {
//         const formData = new FormData();
//         formData.append('file', file);
//
//         try {
//             // 실제 이미지 업로드 API 호출 코드
//             const response = await fetch('/upload-image-endpoint', {
//                 method: 'POST',
//                 body: formData,
//             });
//
//             const result = await response.json();
//             if (result.success) {
//                 return {
//                     success: 1,
//                     file: {
//                         url: result.url, // 서버에서 반환된 이미지 URL
//                     },
//                 };
//             }
//             return { success: 0 }; // 업로드 실패 시 처리
//         } catch (error) {
//             console.error("Image upload failed", error);
//             return { success: 0 };
//         }
//     },
// };