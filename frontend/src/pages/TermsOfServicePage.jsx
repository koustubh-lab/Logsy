import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            {/* <Button variant="ghost" asChild className="mb-4">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button> */}
            <h1 className="text-3xl font-bold tracking-tight">
              Terms of Service
            </h1>
            <p className="text-muted-foreground mt-2">
              Last updated: January 2024
            </p>
          </div>

          <Card>
            <CardContent className="p-8 space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  1. Acceptance of Terms
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using Logsy, you accept and agree to be
                  bound by the terms and provision of this agreement. If you do
                  not agree to abide by the above, please do not use this
                  service.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  2. User Accounts
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    When you create an account with us, you must provide
                    information that is accurate, complete, and current at all
                    times.
                  </p>
                  <p>
                    You are responsible for safeguarding the password and for
                    all activities that occur under your account.
                  </p>
                  <p>
                    You must not use your account for any illegal or
                    unauthorized purpose.
                  </p>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  3. Content Guidelines
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Users are responsible for the content they post on Logsy.
                    Content must not:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Violate any applicable laws or regulations</li>
                    <li>Infringe on intellectual property rights</li>
                    <li>Contain harmful, threatening, or abusive material</li>
                    <li>Include spam or unauthorized advertising</li>
                    <li>Contain malicious code or viruses</li>
                  </ul>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  4. Intellectual Property
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Users retain ownership of content they create and post on
                  Logsy. By posting content, you grant Logsy a
                  non-exclusive, worldwide, royalty-free license to use,
                  display, and distribute your content on the platform.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Termination</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may terminate or suspend your account immediately, without
                  prior notice or liability, for any reason whatsoever,
                  including without limitation if you breach the Terms.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Disclaimer</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The information on this website is provided on an "as is"
                  basis. To the fullest extent permitted by law, this Company
                  excludes all representations, warranties, conditions and
                  terms.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  7. Contact Information
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about these Terms of Service, please
                  contact us at contact@logsy.site
                </p>
              </section>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              <strong>Legal Notice:</strong> This is a template for
              demonstration purposes. Please consult with legal professionals
              for actual terms of service.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
