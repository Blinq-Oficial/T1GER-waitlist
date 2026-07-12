import { ArrowLeft, Mail } from 'lucide-react';

type LegalPageProps = {
  type: 'terms' | 'privacy';
};

const updatedAt = 'July 12, 2026';

function TermsContent() {
  return (
    <>
      <section>
        <h2>1. Agreement and eligibility</h2>
        <p>By using t1ger.app, joining the waitlist, or purchasing Early Adopter Access, you agree to these Terms. You must be at least 18 years old, or have the consent of a parent or legal guardian who accepts these Terms for you.</p>
      </section>
      <section>
        <h2>2. Waitlist and beta access</h2>
        <p>Waitlist positions, referral rankings, launch timing, features, and availability may change. A waitlist position does not guarantee admission on a specific date. Beta software may be incomplete, interrupted, or changed before release.</p>
      </section>
      <section>
        <h2>3. Early Adopter Access</h2>
        <p>The first $5 of a qualifying payment purchases Early Adopter Access, including priority consideration for the Closed Beta, six months of Premium access when available, and a permanent Founder badge subject to account and product availability. Benefits have no cash value and may be replaced with substantially similar benefits if required.</p>
      </section>
      <section>
        <h2>4. Conservation contributions</h2>
        <p>You may choose to pay more than $5. T1GER intends to donate the net amount above $5 to selected organizations supporting wild tiger conservation. “Net amount” means the amount remaining after applicable taxes, Stripe or other payment-processing fees, refunds, chargebacks, currency-conversion costs, and legally required deductions.</p>
        <p>T1GER is not a charity. Your payment is a purchase made to T1GER, not a direct donation to a charity, and no portion should be treated as tax-deductible unless T1GER provides a separate written receipt confirming otherwise. Recipient organizations and donation timing may vary; donation updates may be published when available.</p>
      </section>
      <section id="payments-taxes-and-refunds">
        <h2>5. Payments, taxes, and refunds</h2>
        <p>Payments are processed by Stripe under its own terms and privacy policy. Prices are shown in the checkout currency. Applicable sales, use, VAT, or similar taxes may be added or collected where required.</p>
        <p>You may request a full refund of your Early Adopter payment at any time before T1GER’s public global launch by emailing hello@t1ger.app from the email used at checkout. After the global launch, payments are non-refundable except where required by law. Refunds may take time to appear and access benefits may be revoked.</p>
      </section>
      <section>
        <h2>6. Acceptable use and intellectual property</h2>
        <p>You may not misuse the website, interfere with its operation, attempt unauthorized access, submit fraudulent information, or infringe the rights of others. T1GER’s names, designs, copy, software, and media are owned by T1GER or its licensors and may not be reused without permission.</p>
      </section>
      <section>
        <h2>7. Disclaimers and liability</h2>
        <p>The website and beta services are provided “as is” and “as available” to the fullest extent permitted by law. T1GER does not promise uninterrupted operation or specific personal, business, wellness, or financial outcomes. To the fullest extent permitted by law, T1GER will not be liable for indirect, incidental, special, or consequential damages. T1GER’s aggregate liability relating to a paid Early Adopter purchase will not exceed the amount you paid.</p>
      </section>
      <section>
        <h2>8. Changes and contact</h2>
        <p>We may update these Terms as the product and legal requirements develop. Material changes will be posted here with a new effective date. Questions, refund requests, and legal notices may be sent to hello@t1ger.app.</p>
      </section>
    </>
  );
}

function PrivacyContent() {
  return (
    <>
      <section>
        <h2>1. Information we collect</h2>
        <p>We collect information you provide, including your email address, referral activity, waitlist position, survey or rating responses, and communications with us. For paid access, Stripe provides transaction details such as payment status, amount, currency, and the email used at checkout. T1GER does not receive your complete card number.</p>
      </section>
      <section>
        <h2>2. How we use information</h2>
        <p>We use this information to operate the waitlist, deliver access and transaction emails, prevent fraud, provide support, measure interest, improve T1GER, administer referrals and Early Adopter benefits, comply with law, and send product updates. You can unsubscribe from marketing email using the link in an email or by contacting us.</p>
      </section>
      <section>
        <h2>3. Service providers and disclosures</h2>
        <p>We share data only as needed with providers that support the service, including Vercel for hosting, Supabase for database services, Resend for email delivery, and Stripe for payment processing. We may also disclose information when required by law, to protect rights and security, or in connection with a business transfer.</p>
      </section>
      <section>
        <h2>4. Retention and security</h2>
        <p>We retain information for as long as reasonably necessary for the purposes described above, including legal, accounting, fraud-prevention, and dispute-resolution needs. We use reasonable administrative and technical safeguards, but no online system can guarantee absolute security.</p>
      </section>
      <section>
        <h2>5. Your choices and rights</h2>
        <p>You may ask to access, correct, or delete your personal information, or object to certain uses, by emailing hello@t1ger.app. We may need to verify your identity and may retain information where the law permits or requires it. Rights vary by location.</p>
      </section>
      <section>
        <h2>6. Children and international users</h2>
        <p>T1GER is not directed to children under 13, and we do not knowingly collect their personal information. If you use the service from outside the United States, your information may be processed in the United States and other countries where our providers operate.</p>
      </section>
      <section>
        <h2>7. Changes and contact</h2>
        <p>We may update this Privacy Policy to reflect changes in the service or law. We will post the revised version here with a new effective date. Privacy questions or requests may be sent to hello@t1ger.app.</p>
      </section>
    </>
  );
}

export default function LegalPage({ type }: LegalPageProps) {
  const isTerms = type === 'terms';

  return (
    <main className="min-h-screen bg-[#070707] px-5 py-8 text-white sm:px-8 md:py-14">
      <div className="mx-auto max-w-3xl">
        <a href="/" className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-white/55 transition-colors hover:text-[#CCFF00]">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to T1GER
        </a>
        <header className="mt-10 border-b border-white/10 pb-8">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#FF6B00]">T1GER Legal</p>
          <h1 className="mt-3 font-outfit text-4xl font-black uppercase leading-none sm:text-6xl">{isTerms ? 'Terms & Conditions' : 'Privacy Policy'}</h1>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.12em] text-white/40">Effective {updatedAt}</p>
        </header>
        <article className="legal-copy space-y-8 py-10">
          {isTerms ? <TermsContent /> : <PrivacyContent />}
        </article>
        <footer className="flex flex-col gap-4 border-t border-white/10 py-8 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} T1GER. All rights reserved.</span>
          <a href="mailto:hello@t1ger.app" className="inline-flex items-center gap-2 transition-colors hover:text-white">
            <Mail className="h-4 w-4" aria-hidden="true" />
            hello@t1ger.app
          </a>
        </footer>
      </div>
    </main>
  );
}
