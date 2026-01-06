export function SocialProof() {
  return (
    <section id="testimonials" className="container py-8 md:py-12 lg:py-24">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          Trusted by Top Agencies
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Join thousands of property managers who trust EstateProject.
        </p>
      </div>
      <div className="mx-auto grid max-w-[64rem] grid-cols-2 gap-8 py-12 md:grid-cols-4 md:gap-12">
        <div className="flex items-center justify-center opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0">
          <span className="text-xl font-bold">Acme Corp</span>
        </div>
        <div className="flex items-center justify-center opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0">
          <span className="text-xl font-bold">Globex</span>
        </div>
        <div className="flex items-center justify-center opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0">
          <span className="text-xl font-bold">Soylent</span>
        </div>
        <div className="flex items-center justify-center opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0">
          <span className="text-xl font-bold">Initech</span>
        </div>
      </div>
    </section>
  );
}
