import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Location } from 'react-router-dom';
import Header from '../../header/Header.tsx';
import { destroyEditor, getEditorData, getFormattedToday, initializeEditor } from './DiaryEditor.ts';
import './DiaryEditorPage.css';
import { CategoryTags, initialCategoryTags } from "./TagData.ts";
import { handleTagClick, handleRemoveTag } from './TagHandler.ts';
import {usePrompt} from "./usePrompt.tsx";

export const DiaryEditorPage: React.FC = () => {
    const editorContainerRef = useRef<HTMLDivElement | null>(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const [categoryTags, setCategoryTags] = useState<CategoryTags>(initialCategoryTags);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [showAddCategoryButton, setShowAddCategoryButton] = useState<boolean>(false);
    const [selectedTags, setSelectedTags] = useState<{ id: number; emoji: string; label: string }[]>([]);
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

    const [isAddingTag, setIsAddingTag] = useState(false);
    const [newTagName, setNewTagName] = useState("");

    const formattedDate = getFormattedToday();

    const { questionText } = useParams<{ questionText: string }>();
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [title, setTitle] = useState(questionText || "제목을 입력해주세요!");

    const [isWriting, setIsWriting] = useState(false); // 일기 작성 여부
    const [pendingNavigation, setPendingNavigation] = useState<null | (() => void)>(null);
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [shouldNavigate, setShouldNavigate] = useState(false);

    useEffect(() => {
        const checkAuthAndFetchData = async () => {
            try {
                // 1. 사용자 인증 상태 확인
                const userRes = await fetch('http://localhost:8080/api/auth/me', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });

                if (!userRes.ok) {
                    // 서버 응답이 성공(2xx)이 아니거나, 특히 401 Unauthorized인 경우
                    console.warn('인증되지 않은 접근 또는 세션 만료:', userRes.status);
                    alert('로그인이 필요하거나 세션이 만료되었습니다. 다시 로그인해주세요.');
                    navigate('/');
                    return;
                }

                // 2. URL 파라미터로 받은 질문 타이틀 설정
                if (questionText) {
                    setTitle(decodeURIComponent(questionText) + '?');
                }

                // 3. 에디터 초기화
                if (editorContainerRef.current) {
                    //initializeEditor(editorContainerRef.current);
                    initializeEditor(editorContainerRef.current, onEditorChange);
                }

                // 4. 기타 태그 불러오기
                const accessToken = localStorage.getItem("accessToken");
                fetch('http://localhost:8080/api/category/6' , {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    },
                    credentials: "include"
                })
                    .then(async response => {
                        if (response.status === 204) {
                            return []; // 내용 없을 때 빈 배열 반환
                        } else if (!response.ok) {
                            throw new Error(`기타 태그 불러오기 실패: ${response.status}`);
                        }
                        return await response.json();
                    })
                    .then(data => {
                        console.log('서버에서 가져온 기타 태그 데이터:', data);

                        const newTag = data.map((tag: any) => ({
                            id: tag.tagId,
                            emoji: '🏷️',
                            label: tag.name
                        }));

                        setCategoryTags(prev => ({
                            ...prev,
                            '기타': newTag
                        }));

                        setNewTagName('');
                        setIsAddingTag(false);
                    })
                    .catch(error => {
                        console.error('기타 태그 불러오기 중 오류 발생:', error);
                    });

            } catch (error) {
                console.error('페이지 초기 로딩 중 치명적인 오류 발생:', error);
                alert('페이지 로딩 중 오류가 발생했습니다. 다시 시도해주세요.');
                navigate('/');
            }
        };

        checkAuthAndFetchData();

        return () => {
            destroyEditor();
        };
    }, [questionText, navigate]);

    useEffect(() => {
        if (shouldNavigate && pendingNavigation) {
            pendingNavigation();  // 모달 닫힌 뒤에 이동
            setPendingNavigation(null); // 초기화
            setShouldNavigate(false); // 초기화
        }
    }, [shouldNavigate, pendingNavigation]);

    useEffect(() => {
        const handleLogoutClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('#logout-btn')) {
                if (isWriting) {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowLeaveModal(true);
                }
            }
        };

        window.addEventListener('click', handleLogoutClick, true); // 캡처 단계에서 감지

        return () => {
            window.removeEventListener('click', handleLogoutClick, true);
        };
    }, [isWriting]);

    // 일기 저장
    const handleSave = async () => {
        setIsWriting(false);
        const content = await getEditorData();
        const accessToken = localStorage.getItem("accessToken");
        const diaryData = {
            title: title,
            content: content,
        };

        const tagList = selectedTagIds.map(id => ({ tagId: id }));

        const requestData = {
            diary: diaryData,
            tags: tagList
        };

        console.log("보내는 데이터:", JSON.stringify(requestData));

        try {
            const response = await fetch('http://localhost:8080/api/diary/save', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}` // Bearer 토큰 방식도 함께 사용한다면
                },
                credentials: "include", // HTTPOnly 쿠키도 함께 전송
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                // 저장 API 호출 중 인증 문제 발생 시
                if (response.status === 401) {
                    alert('세션이 만료되어 저장이 불가능합니다. 다시 로그인해주세요.');
                    navigate('/'); // 로그인 페이지로 리다이렉트
                    return;
                }
                throw new Error(`서버 응답 실패: ${response.status}`);
            }

            console.log("서버에 저장 완료:", await response.json());
            setShowModal(true); // 성공 시 모달 열기
        } catch (error) {
            console.error("저장 중 오류 발생:", error);
            alert("저장에 실패했습니다. 다시 시도해주세요.");
        }
    };

    // 모달 닫기
    const closeModal = () => {
        setShowModal(false);
        navigate('/list'); // 저장 완료 후 목록 페이지로 리다이렉션
    };

    // 카테고리 전환 처리
    const handleCategoryClick = (category: string) => {
        if (selectedCategory === category) {
            setSelectedCategory('');
            setShowAddCategoryButton(false);
        } else {
            setSelectedCategory(category);
            setShowAddCategoryButton(category === '기타');
        }
    };

    // 커스텀 태그 입력 모드로 전환
    const handleAddTagClick = () => {
        setIsAddingTag(true);
    };

    // 태그 생성
    const handleNewTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && newTagName.trim() !== '') {
            const newTag = {
                name: newTagName.trim(),
                categoryId: 6, // 기타 카테고리 ID
            };
            console.log("태그 생성:", newTag);
            const accessToken = localStorage.getItem("accessToken"); // 태그 생성 시점에 토큰 다시 가져오기

            fetch('http://localhost:8080/api/tag/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                credentials: "include",
                body: JSON.stringify(newTag),
            })
                .then(response => {
                    if (!response.ok) {
                        if (response.status === 401) {
                            alert('세션이 만료되어 태그 생성이 불가능합니다. 다시 로그인해주세요.');
                            navigate('/');
                            throw new Error('Unauthorized');
                        }
                        throw new Error(`태그 생성 서버 응답 실패: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("태그가 성공적으로 추가되었습니다:", data);
                    const createdTag = {
                        id: data.id,
                        emoji: '🏷️',
                        label: data.name
                    };
                    setCategoryTags(prev => ({
                        ...prev,
                        '기타': [
                            ...prev['기타'],
                            createdTag
                        ]
                    }));
                    setNewTagName('');
                    setIsAddingTag(false);
                })
                .catch(error => {
                    console.error("태그 생성 중 오류 발생:", error);
                    if (error.message !== 'Unauthorized') { // 이미 처리된 401 오류는 제외
                        alert('태그 생성에 실패했습니다.');
                    }
                });
        } else if (e.key === 'Escape') {
            setNewTagName('');
            setIsAddingTag(false);
        }
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleTitleBlur = () => {
        setIsEditingTitle(false);
    };

    const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setIsEditingTitle(false);
        }
    };

    // 일기 작성 여부
    const onEditorChange = async () => {
        try {
            const content = await getEditorData();
            if (!content || content.trim().length === 0) {
                return;
            }
            setIsWriting(true);
        } catch (error) {
            console.error("에디터 데이터 로딩 실패:", error);
        }
    };

    usePrompt(isWriting, (nextLocation: Location) => {
        setPendingNavigation(() => () => navigate(nextLocation.pathname));
        setShowLeaveModal(true);
        return false;  // 이동 막음
    });

    // 예 클릭 시 실제 이동 수행
    const confirmLeave = () => {
        setShowLeaveModal(false);
        setIsWriting(false);
        setShouldNavigate(true);
    };

    const cancelLeave = () => {
        setShowLeaveModal(false);
    };

    return (
        <div className="diary-page">
            <Header />
            <main className="main-content">
                {isEditingTitle ? (
                    <input
                        className="title-input"
                        type="text"
                        value={title}
                        onChange={handleTitleChange}
                        onBlur={handleTitleBlur}
                        onKeyDown={handleTitleKeyDown}
                        autoFocus
                    />
                ) : (
                    <h1 className="title" onClick={() => setIsEditingTitle(true)}>
                        {title}
                    </h1>
                )}
                <p className="date">{formattedDate}</p>
                <div
                    className="editor-container"
                    ref={editorContainerRef}
                ></div>

                <div className="tag-section">
                    <div className="selected-tags-list">
                        {selectedTags.map((tag) => (
                            <span key={tag.id} className="tag"
                                  onClick={() => handleRemoveTag(tag, selectedTags, selectedTagIds, setSelectedTags, setSelectedTagIds)}>
                                #{tag.label}
                            </span>
                        ))}
                    </div>
                    <div className="category-buttons">
                        {['기분', '생활 & 경험', '취미', '특별한 순간', '날씨', '기타'].map((category) => (
                            <button
                                key={category}
                                className={`category ${selectedCategory === category ? 'active' : ''}`}
                                onClick={() => handleCategoryClick(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {selectedCategory && (
                        <div className="tag-section">
                            {categoryTags[selectedCategory].map((tag) => (
                                <span
                                    key={tag.id}
                                    className="category-tag"
                                    onClick={() => handleTagClick(tag, selectedTags, selectedTagIds, setSelectedTags, setSelectedTagIds)}
                                    data-id={tag.id}
                                >
                                    {tag.emoji} {tag.label}
                                </span>
                            ))}
                        </div>
                    )}

                    {showAddCategoryButton && (
                        <div className="tag-add">
                            {isAddingTag ? (
                                <input
                                    type="text"
                                    value={newTagName}
                                    onChange={(e) => setNewTagName(e.target.value)}
                                    onKeyDown={handleNewTagKeyDown}
                                    placeholder="태그 입력 후 Enter"
                                    className="new-tag-input"
                                    autoFocus
                                />
                            ) : (
                                <button className="add-category-button" onClick={handleAddTagClick}>
                                    +
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <div className="button-wrapper">
                    <button className="submit-button" onClick={handleSave}>작성 완료</button>
                </div>
            </main>

            {/* 모달창 */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <p>저장이 완료되었습니다!</p>
                        <button className="modal-close-button" onClick={closeModal}>확인</button>
                    </div>
                </div>
            )}

            {showLeaveModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <p>작성 중인 내용이 있습니다. 이동하시겠습니까?</p>
                        <div className="modal-button-group">
                            <button className="modal-close-button" onClick={confirmLeave}>예</button>
                            <button className="modal-close-button" onClick={cancelLeave}>아니요</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DiaryEditorPage;