"use client";

export default function SimpleDiagnostic() {
    return (
        <div style={{ padding: '50px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
            <h1 style={{ color: 'black', fontSize: '48px', marginBottom: '20px' }}>
                🔍 Diagnostic Page
            </h1>

            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', marginBottom: '20px' }}>
                <h2 style={{ color: 'green', fontSize: '32px' }}>✅ If you can see this, React is working!</h2>
                <p style={{ color: 'black', fontSize: '18px' }}>
                    This means the server is running correctly and client-side rendering is functional.
                </p>
            </div>

            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', marginBottom: '20px' }}>
                <h3 style={{ color: 'black', fontSize: '24px', marginBottom: '15px' }}>Next Steps:</h3>
                <ol style={{ color: 'black', fontSize: '16px', lineHeight: '1.8' }}>
                    <li>Open browser DevTools (F12)</li>
                    <li>Go to the Console tab</li>
                    <li>Navigate to <code>http://localhost:3000</code></li>
                    <li>Look for any RED error messages</li>
                    <li>Share those error messages with me</li>
                </ol>
            </div>

            <div style={{ backgroundColor: '#fff3cd', padding: '30px', borderRadius: '10px', border: '2px solid #ffc107' }}>
                <h3 style={{ color: '#856404', fontSize: '20px', marginBottom: '10px' }}>⚠️ Possible Issues:</h3>
                <ul style={{ color: '#856404', fontSize: '16px', lineHeight: '1.8' }}>
                    <li>Framer Motion animation errors</li>
                    <li>API route failures</li>
                    <li>Missing environment variables</li>
                    <li>JavaScript bundle loading issues</li>
                </ul>
            </div>

            <div style={{ marginTop: '30px' }}>
                <a
                    href="/"
                    style={{
                        display: 'inline-block',
                        padding: '15px 30px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '5px',
                        fontSize: '18px',
                        fontWeight: 'bold'
                    }}
                >
                    ← Back to Home Page
                </a>
            </div>
        </div>
    );
}
