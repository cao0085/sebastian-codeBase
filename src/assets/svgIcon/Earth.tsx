

export default function EarthIcon({ size = 24, ...props }){

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
            <path d="M2.25 12a9.75 9.75 0 1 0 19.5 0 9.75 9.75 0 1 0-19.5 0Z" />
            <path d="M12 2.25c2.75 2.4 4.5 5.76 4.5 9.75s-1.75 7.35-4.5 9.75c-2.75-2.4-4.5-5.76-4.5-9.75S9.25 4.65 12 2.25Z" />
            <path d="M20.25 12h-16.5" />
        </svg>
    )
}

