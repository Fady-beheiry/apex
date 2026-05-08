import { Layout } from "@/components/layout";

export default function Terms() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 md:py-24 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8">Terms of Service</h1>
        
        <div className="prose prose-invert max-w-none font-sans normal-case text-muted-foreground space-y-6">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-black uppercase tracking-wide text-white mt-12 mb-4">1. General</h2>
          <p>By accessing the APEX Athletics website, you agree to be bound by these terms of service and comply with all applicable laws and regulations. If you disagree with any of these terms, you are prohibited from using or accessing this site.</p>
          
          <h2 className="text-2xl font-black uppercase tracking-wide text-white mt-12 mb-4">2. Purchases</h2>
          <p>All orders are subject to availability and confirmation of the order price. We reserve the right to refuse any order. In the event we need to cancel an order, we will attempt to notify you using the contact information provided.</p>
          
          <h2 className="text-2xl font-black uppercase tracking-wide text-white mt-12 mb-4">3. Intellectual Property</h2>
          <p>The APEX brand, logo, designs, imagery, and all related intellectual property are the exclusive property of APEX Athletics. Unauthorized use, reproduction, or distribution is strictly prohibited and will be pursued legally.</p>
          
          <h2 className="text-2xl font-black uppercase tracking-wide text-white mt-12 mb-4">4. Product Descriptions</h2>
          <p>We attempt to be as accurate as possible in our product descriptions. However, we do not warrant that product descriptions or other content is entirely accurate, complete, reliable, current, or error-free.</p>
        </div>
      </div>
    </Layout>
  );
}
