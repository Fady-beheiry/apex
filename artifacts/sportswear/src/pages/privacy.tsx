import { Layout } from "@/components/layout";

export default function Privacy() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 md:py-24 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8">Privacy Policy</h1>
        
        <div className="prose prose-invert max-w-none font-sans normal-case text-muted-foreground space-y-6">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-black uppercase tracking-wide text-white mt-12 mb-4">1. Information We Collect</h2>
          <p>We collect information you provide directly to us when you make a purchase, create an account, or contact our concierge service. This may include your name, email address, phone number, shipping address, and payment information.</p>
          
          <h2 className="text-2xl font-black uppercase tracking-wide text-white mt-12 mb-4">2. How We Use Your Information</h2>
          <p>We use the information we collect to fulfill your orders, provide client support, send important updates about your account, and deliver a personalized APEX experience. We do not sell your personal data to third parties.</p>
          
          <h2 className="text-2xl font-black uppercase tracking-wide text-white mt-12 mb-4">3. Security</h2>
          <p>We implement elite-level security measures to protect your personal information. All transactions are encrypted using secure socket layer technology (SSL) and stored with industry-standard encryption.</p>
          
          <h2 className="text-2xl font-black uppercase tracking-wide text-white mt-12 mb-4">4. Cookies</h2>
          <p>Our digital platforms use cookies to maintain your cart session, remember your preferences, and optimize site performance. You can control cookie preferences through your browser settings.</p>
        </div>
      </div>
    </Layout>
  );
}
