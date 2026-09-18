import { SearchHero } from '../components/search/SearchHero';
import { motion } from 'framer-motion';
import { BookOpen, Shield, Zap, Search } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

const features = [
  {
    icon: Search,
    title: 'Smart Recommendations',
    description: 'Paste any tender specification and get ranked BIS standard recommendations instantly.',
  },
  {
    icon: Shield,
    title: 'Certification Clarity',
    description: 'Know exactly which standards require ISI Mark, CRS registration, or QCO compliance.',
  },
  {
    icon: BookOpen,
    title: 'Cross-Reference Intelligence',
    description: 'Automatically discover normative references and avoid missing critical linked standards.',
  },
  {
    icon: Zap,
    title: 'AI-Powered Assistant',
    description: 'Ask questions in plain language and get cited answers grounded in BIS documents.',
  },
];

export function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
        {/* Subtle radial glow */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-indigo-500/10 dark:bg-indigo-400/5 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
              {t('hero.title.start')}{' '}
              <span className="text-indigo-600 dark:text-indigo-400">{t('hero.title.highlight')}</span>
              {' '}{t('hero.title.end')}
            </h1>
            <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <SearchHero />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-12"
          >
            Built for procurement officers
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                      <Icon size={20} />
                    </div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {[
              { value: '23,847', label: 'Standards indexed' },
              { value: '156', label: 'QCO items tracked' },
              { value: '4,200+', label: 'Cross-references mapped' },
              { value: '< 2s', label: 'Average response time' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <div className="text-2xl font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
