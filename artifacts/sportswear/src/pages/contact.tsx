import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function Contact() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 md:py-24 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          
          <div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6">Contact APEX</h1>
            <p className="text-muted-foreground font-sans normal-case mb-12">
              For inquiries regarding orders, products, or elite partnerships, please reach out. Our concierge team is available 24/7.
            </p>

            <div className="space-y-8">
              <div>
                <h3 className="font-bold uppercase tracking-widest text-sm mb-2 text-white">Client Concierge</h3>
                <p className="text-muted-foreground font-sans normal-case">support@apex-athletics.com</p>
              </div>
              <div>
                <h3 className="font-bold uppercase tracking-widest text-sm mb-2 text-white">Press & Partnerships</h3>
                <p className="text-muted-foreground font-sans normal-case">partners@apex-athletics.com</p>
              </div>
              <div>
                <h3 className="font-bold uppercase tracking-widest text-sm mb-2 text-white">Global Headquarters</h3>
                <p className="text-muted-foreground font-sans normal-case">
                  One Apex Plaza<br/>
                  Los Angeles, CA 90014<br/>
                  United States
                </p>
              </div>
            </div>
          </div>

          <div className="bg-secondary/30 p-8 border border-border">
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-6">Send a Message</h2>
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="uppercase tracking-widest text-xs font-bold text-muted-foreground">Full Name</Label>
                <Input id="name" className="bg-background border-border rounded-none" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="uppercase tracking-widest text-xs font-bold text-muted-foreground">Email Address</Label>
                <Input id="email" type="email" className="bg-background border-border rounded-none" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject" className="uppercase tracking-widest text-xs font-bold text-muted-foreground">Subject</Label>
                <Input id="subject" className="bg-background border-border rounded-none" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="uppercase tracking-widest text-xs font-bold text-muted-foreground">Message</Label>
                <Textarea id="message" rows={5} className="bg-background border-border rounded-none resize-none" />
              </div>
              <Button type="button" className="w-full bg-white text-black hover:bg-gray-200 rounded-none uppercase tracking-widest font-bold">
                Send Message
              </Button>
            </form>
          </div>

        </div>
      </div>
    </Layout>
  );
}
