import Header from "../../compoents/Header";

export default function MainLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <main className="container min-h-screen">
            <Header/>
            {children}
        </main>
    )
}