export default function HowItWorksSection() {
  const steps = [
    { step: "1", title: "Create Room", desc: "Set up a shared space for your group" },
    { step: "2", title: "Add Members & Bills", desc: "Invite people and start tracking expenses" },
    { step: "3", title: "Split & Track", desc: "Choose how to split and mark payments" }
  ];

  return (
    <section className="space-y-10">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">How it works</h2>
        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Get started in minutes with our simple 3-step process.
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-8">
        {steps.map((item, i) => (
          <div key={i} className="text-center md:col-span-1 lg:col-span-2">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xl font-bold flex items-center justify-center mx-auto mb-4 shadow-lg">
              {item.step}
            </div>
            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
