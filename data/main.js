// === Animation with GSAP and ScrollTrigger ===
gsap.registerPlugin(ScrollTrigger);

let onlineTimerStarted = false;

function initializeGSAP() {
    const noteItems = document.querySelectorAll(".note-item");

    gsap.from(".header-main", {
        scrollTrigger: {
            trigger: ".header-main",
            start: "top center-=180",
            end: "bottom center",
            toggleActions: "play none none reverse"
        },
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: "power2.out"
    });

    gsap.from(".header-sub", {
        scrollTrigger: {
            trigger: ".header-sub",
            start: "top center-=180",
            end: "bottom center",
            toggleActions: "play none none reverse"
        },
        y: 100,
        opacity: 0,
        duration: 1.5,
        delay: 0.5,
        ease: "power2.out"
    });

    const sideElements = [".side-about", ".side-notes", ".side-tags"];
    sideElements.forEach((selector, index) => {
        gsap.from(selector, {
            scrollTrigger: {
                trigger: selector,
                start: "top bottom-=300",
                end: "bottom center",
                toggleActions: "play none none none"
            },
            x: 100,
            opacity: 0,
            duration: 2,
            delay: 0.1 + (index * 0.1),
            ease: "power2.out",
        });
    });

    gsap.from(".side-online-timer", {
        scrollTrigger: {
            trigger: ".side-online-timer",
            start: `top bottom-=300`,
            end: "bottom center",
            toggleActions: "play none none none",
            onEnter: () => {
                if (!onlineTimerStarted) {
                    setTimeout(() => {
                        updateOnlineTimer();
                        onlineTimerStarted = true;
                    }, 500);
                }
            }
        },
        x: 100,
        opacity: 0,
        duration: 1,
        delay: 1,
        ease: "power2.out"
    });

    ScrollTrigger.batch(".note-item", {
        start: "top 90%",
        end: "bottom 10%",
        onEnter: (batch) => {
            gsap.fromTo(batch, 
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power2.out" }
            );
        },
        onLeave: (batch) => {
            gsap.to(batch, { y: 50, opacity: 0, duration: 0.8, stagger: 0.1 });
        },
        onEnterBack: (batch) => {
            gsap.fromTo(batch,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power2.out" }
            );
        },
        onLeaveBack: (batch) => {
            gsap.to(batch, { y: 50, opacity: 0, duration: 0.8, stagger: 0.1 });
        }
    });

}

// === Online Timer ===
function updateOnlineTimer() {
    const startTime = new Date('2024-09-01');
    const now = new Date();
    const diffInSeconds = Math.floor((now - startTime) / 1000);

    const years = Math.floor(diffInSeconds / (3600 * 24 * 365));
    const days = Math.floor((diffInSeconds % (3600 * 24 * 365)) / (3600 * 24));

    const timerElement = document.getElementById('side-online-timer');
    timerElement.innerHTML = `
        <div style="font-size: 1em;">おこわの資訊部屋 已上線</div>
        <div id="random-number" style="font-size: 2em; font-weight: bold;"></div>
    `;

    const numberElement = document.getElementById('random-number');
    let count = 0;

    const interval = setInterval(() => {
        const randomY = Math.floor(Math.random() * 99);
        const randomD = Math.floor(Math.random() * 365);
        numberElement.textContent = `${randomY} 年 ${randomD} 天`;

        gsap.fromTo(numberElement, 
            { opacity: 0.3, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 0.05, ease: "power1.out" }
        );

        count++;
        if (count > 25) { // 約 1.25 秒後停止
            clearInterval(interval);
            // 最後淡出 → 顯示真實時間
            gsap.to(numberElement, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    numberElement.textContent = `${years} 年 ${days} 天`;
                    gsap.fromTo(numberElement,
                        { opacity: 0, scale: 0.9 },
                        { opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" }
                    );
                }
            });
        }
    }, 50);
}

function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
  
    const clockElement = document.getElementById('top-clock');
    clockElement.innerHTML = `${hours}<span style="opacity:${Number(now.getSeconds() % 2 === 0)}">:</span>${minutes}`;
}



// === Note ===
async function getNotes() {
  try {
    const res = await fetch('/api/notes');
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (err) {
    return [];
  }
}

function generateNoteCards() {
    return new Promise((resolve) => {
        let first = false;

        getNotes().then(notes => {
            const notesContainer = document.getElementById('notes-container');
            notesContainer.innerHTML = '';
            notes.forEach(note => {

                if (!first) {
                    first = true;
                    const headerNote = document.getElementById('header-note');
                    headerNote.innerHTML = ``

                    headerNote.style = `
                        background: url(./contents/${note.name}/thumbnail.jpg);
                        background-size: cover;
                        background-position: center;
                        background-repeat: no-repeat;
                        cursor: pointer;

                        font-size: 1.6em;
                        font-family: 'Saira', Arial, sans-serif;
                        color: white;
                        display: flex;
                        justify-content: left;
                        align-items: flex-end;
                    `;

                    headerNote.onclick = () => {
                        console.log(`Clicked on header note: ${note.name}`);
                        // You can add navigation to the note detail page here
                    }

                    headerNote.addEventListener('mouseenter', () => {
                        headerNote.style.backgroundImage = `linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent), url(./contents/${note.name}/thumbnail.jpg)`;
                        headerNote.innerHTML = `${note.metadata.title}`;
                    });
                    headerNote.addEventListener('mouseleave', () => {
                        headerNote.style.backgroundImage = `url(./contents/${note.name}/thumbnail.jpg)`;
                        headerNote.innerHTML = '';
                    });
                }

                const card = document.createElement('div');
                card.className = 'note-item';
                card.innerHTML = `
                    <img src="./contents/${note.name}/thumbnail.jpg">
                    <div class="note-item-topic">${note.metadata.topic || 'No topic available.'}</div>
                    <div class="note-item-title">${note.metadata.title}</div>
                    <div class="note-item-tags">${(note.metadata.tags || []).join(', ')}</div>
                `;
                card.onclick = () => {
                    console.log(`Clicked on note: ${note.name}`);
                    // You can add navigation to the note detail page here
                }
                notesContainer.appendChild(card);
            });
            
            // 卡片生成完成後執行 resolve
            resolve();
        });
    });
}

// === Tags ===
function generateTagItem() {
    getNotes().then(notes => {
        const allTags = Array.from(new Set(notes.flatMap(note => note.metadata.tags || [])));

        const tagsContainer = document.getElementById('side-tags-container');
        tagsContainer.innerHTML = '';
        allTags.forEach(tag => {
            const count = notes.filter(note => (note.metadata.tags || []).includes(tag)).length;
            const tagItem = document.createElement('div');
            tagItem.className = 'tag-item';
            // 將文字包成 label，讓 CSS 能控制換行與與 badge 同行顯示
            tagItem.innerHTML = `<span class="tag-item-label">${tag}</span><span class="tag-item-count">${count}</span>`;

            tagItem.onclick = () => {
                console.log(`Tag clicked: ${tag}`);
                // 可在此加入過濾 notes 的邏輯，顯示該 tag 的記事
            };

            tagsContainer.appendChild(tagItem);
        });
    });
}

async function getNote(noteName) {
    try {
        const res = await fetch(`/api/notes/${noteName}`);
        const data = await res.json();
        return data.success ? data.data : null;
    } 
    catch (err) {
        return null;
    }
}
               

document.addEventListener('DOMContentLoaded', () => {
    generateNoteCards().then(() => {
        initializeGSAP();
    });
    
    generateTagItem();
    updateClock(); 
    setInterval(updateClock, 1000);
});

