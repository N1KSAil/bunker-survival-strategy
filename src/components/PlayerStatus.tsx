const PlayerStatus = () => {
  return (
    <div className="bg-bunker-accent rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Статус игрока</h2>
      <div className="space-y-4">
        <div className="bg-bunker-bg p-3 rounded">
          <h3 className="font-medium mb-2">Характеристики</h3>
          <ul className="space-y-2">
            <li>Пол: Не определен</li>
            <li>Профессия: Не определена</li>
            <li>Здоровье: Неизвестно</li>
            <li>Хобби: Не указано</li>
          </ul>
        </div>
        
        <div className="bg-bunker-bg p-3 rounded">
          <h3 className="font-medium mb-2">Инвентарь</h3>
          <p className="text-sm">Рюкзак пуст</p>
        </div>
      </div>
    </div>
  );
};

export default PlayerStatus;