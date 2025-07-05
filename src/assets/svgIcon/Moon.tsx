



export default function MoonIcon({ size = 24, ...props }){

    return(
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M21 12.79A9 9 0 0 1 11.21 3 7.5 7.5 0 1 0 21 12.79z" />
        </svg>
    )
}