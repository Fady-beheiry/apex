import { Layout } from "@/components/layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQ() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 md:py-24 max-w-3xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Frequently Asked Questions</h1>
          <p className="text-muted-foreground font-sans normal-case">
            Everything you need to know about APEX performance gear, shipping, and returns.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="item-1" className="border border-border bg-secondary/10 px-6 py-2">
            <AccordionTrigger className="font-bold uppercase tracking-wide hover:no-underline">What makes APEX gear elite?</AccordionTrigger>
            <AccordionContent className="font-sans normal-case text-muted-foreground leading-relaxed">
              APEX gear is engineered using proprietary technical fabrics developed over years of rigorous testing by professional athletes. Every seam is considered, every silhouette designed for maximum range of motion while maintaining our signature stealth aesthetic.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border border-border bg-secondary/10 px-6 py-2">
            <AccordionTrigger className="font-bold uppercase tracking-wide hover:no-underline">How long does shipping take?</AccordionTrigger>
            <AccordionContent className="font-sans normal-case text-muted-foreground leading-relaxed">
              We offer global express shipping on all orders. Domestic orders typically arrive within 2-3 business days. International orders arrive within 4-7 business days depending on customs clearance.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border border-border bg-secondary/10 px-6 py-2">
            <AccordionTrigger className="font-bold uppercase tracking-wide hover:no-underline">What is your return policy?</AccordionTrigger>
            <AccordionContent className="font-sans normal-case text-muted-foreground leading-relaxed">
              We accept returns within 30 days of delivery for unworn, unwashed items in their original condition with all tags attached. The return shipping fee is deducted from your refund.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border border-border bg-secondary/10 px-6 py-2">
            <AccordionTrigger className="font-bold uppercase tracking-wide hover:no-underline">How do I care for my technical garments?</AccordionTrigger>
            <AccordionContent className="font-sans normal-case text-muted-foreground leading-relaxed">
              To maintain the integrity of our technical fabrics, machine wash cold with similar colors. Do not use fabric softeners or bleach. Tumble dry on low heat or hang to dry. Never iron or dry clean.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5" className="border border-border bg-secondary/10 px-6 py-2">
            <AccordionTrigger className="font-bold uppercase tracking-wide hover:no-underline">Do you offer athletic sponsorships?</AccordionTrigger>
            <AccordionContent className="font-sans normal-case text-muted-foreground leading-relaxed">
              We selectively partner with elite athletes who embody the APEX philosophy. For partnership inquiries, please contact partners@apex-athletics.com with your athletic resume.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Layout>
  );
}
