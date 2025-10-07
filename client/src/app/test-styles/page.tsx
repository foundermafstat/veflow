export default function TestStylesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section Test */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900" />
        
        <div className="relative z-10 container mx-auto px-6 py-16 md:py-24">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="hero-title mb-8 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
              Тест стилей
            </h1>
            
            <h2 className="hero-subtitle text-gray-600 dark:text-gray-300 mb-8">
              Проверка отступов и размеров
            </h2>
            
            <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-16 mx-auto leading-relaxed max-w-3xl">
              Эта страница демонстрирует исправленные стили с правильными отступами, размерами шрифтов и spacing.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
              <button className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 rounded-lg">
                Основная кнопка
              </button>
              
              <button className="px-8 py-4 text-lg font-semibold border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 rounded-lg">
                Вторичная кнопка
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-3">100%</div>
                <div className="text-base text-gray-500 dark:text-gray-400">Успех</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-green-600 dark:text-green-400 mb-3">24/7</div>
                <div className="text-base text-gray-500 dark:text-gray-400">Поддержка</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-purple-600 dark:text-purple-400 mb-3">1M+</div>
                <div className="text-base text-gray-500 dark:text-gray-400">Пользователей</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section Test */}
      <section className="section-spacing bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="section-title mb-12 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent text-center">
              Тест секций
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 text-center leading-relaxed max-w-4xl mx-auto">
              Проверка отступов в секциях с правильным spacing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:-translate-y-2 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                  <div className="w-8 h-8">📊</div>
                </div>
                <span className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">Тест</span>
              </div>
              <h3 className="feature-title group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-4">
                Карточка 1
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Это тестовая карточка для проверки отступов и размеров шрифтов.
              </p>
            </div>

            <div className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:-translate-y-2 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <div className="w-8 h-8">🚀</div>
                </div>
                <span className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">Тест</span>
              </div>
              <h3 className="feature-title group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-4">
                Карточка 2
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Вторая тестовая карточка с правильными отступами.
              </p>
            </div>

            <div className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:-translate-y-2 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                  <div className="w-8 h-8">✅</div>
                </div>
                <span className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">Тест</span>
              </div>
              <h3 className="feature-title group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-4">
                Карточка 3
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Третья карточка для полной проверки стилей.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
