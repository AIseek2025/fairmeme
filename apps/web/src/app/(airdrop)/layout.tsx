import TopSidebar from '@/components/Airdrop/Sidebar';

export default function Layout({ children }: React.PropsWithChildren) {
    return (
        <>
            <TopSidebar />
            {children}
        </>
    );
}
