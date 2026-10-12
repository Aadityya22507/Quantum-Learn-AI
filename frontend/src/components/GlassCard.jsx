export default function GlassCard({
    children,
    className=""
}){

    return(

        <div
        className={`

        rounded-3xl
        border
        border-white/10

        bg-white/5

        backdrop-blur-xl

        shadow-2xl

        hover:-translate-y-2

        transition-all

        duration-500

        hover:border-cyan-400/40

        ${className}

        `}
        >

            {children}

        </div>

    )

}