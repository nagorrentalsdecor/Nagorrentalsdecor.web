export default function TestPage() {
    return (
        <div style={{ padding: '50px', backgroundColor: 'white' }}>
            <h1 style={{ color: 'black', fontSize: '32px' }}>Test Page - If you can see this, the server is working!</h1>
            <p style={{ color: 'black' }}>This page has no animations or complex components.</p>
            <p style={{ color: 'black' }}>If this shows but the home page doesn't, the issue is with Framer Motion or client-side JavaScript.</p>
        </div>
    );
}
