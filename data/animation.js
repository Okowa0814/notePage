gsap.registerPlugin(ScrollTrigger);

let onlineTimerStarted = false;

function initializeGSAP() {
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

    const pageHeight = document.documentElement.clientHeight;
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
        <div id="random-number" style="font-size: 3em; font-weight: bold;"></div>
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

document.addEventListener('DOMContentLoaded', initializeGSAP);
