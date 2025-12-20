export function Footer() {
    return (
        <footer className={"pt-12 pb-8 flex flex-col items-center gap-6 border-t border-border-light dark:border-border-dark mt-12"}>
            <svg
                className={"text-text-main-light dark:text-text-main-dark opacity-80"}
                fill="none"
                height="40"
                viewBox="0 0 100 40"
                width="100"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M10 30 C 20 10, 30 10, 40 30 C 50 10, 60 10, 70 30 L 90 10"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2"
                ></path>
            </svg>
            <div className={"text-[10px] text-text-muted-light dark:text-text-muted-dark text-center space-y-2"}>
                <p>Designed for Scientific Discovery</p>
                <p>© 2024 Sarkome Institute. All rights reserved.</p>
            </div>
            <div className={"w-full flex justify-between text-[10px] text-text-muted-light dark:text-text-muted-dark mt-4"}>
                <div className={"flex items-center gap-1"}>
                    <span className={"material-symbols-outlined text-[12px]"}>location_on</span>
                    CAMBRIDGE, MA
                </div>
                <div className={"flex items-center gap-1"}>
                    <span className={"material-symbols-outlined text-[12px]"}>wb_sunny</span>
                    24°C
                </div>
            </div>
        </footer>
    );
}
