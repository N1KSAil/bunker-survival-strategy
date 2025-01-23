const ResourceTracker = () => {
  return (
    <div className="bg-bunker-accent rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Бункер</h2>
      <div className="space-y-4">
        <div className="bg-bunker-bg p-3 rounded">
          <h3 className="font-medium mb-2">Информация о бункере</h3>
          <ul className="space-y-2 text-sm">
            <li>Размер: 300 кв. метров</li>
            <li>Время нахождения: 1 год</li>
            <li>Количество еды: На 6 месяцев</li>
          </ul>
        </div>
        
        <div className="bg-bunker-bg p-3 rounded">
          <h3 className="font-medium mb-2">Информация о катаклизме</h3>
          <ul className="space-y-2 text-sm">
            <li>Тип: Ядерная война</li>
            <li>Масштаб: Глобальный</li>
            <li>Радиационный фон: Критический</li>
            <li>Прогноз: Восстановление через 15-20 лет</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResourceTracker;