const ResourceTracker = () => {
  return (
    <div className="bg-bunker-accent rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Бункер</h2>
      <div className="space-y-4">
        <div className="bg-bunker-bg p-3 rounded">
          <h3 className="font-medium mb-2">Информация</h3>
          <ul className="space-y-2 text-sm">
            <li>Размер: Неизвестно</li>
            <li>Время нахождения: Неизвестно</li>
            <li>Количество еды: Неизвестно</li>
          </ul>
        </div>
        
        <div className="bg-bunker-bg p-3 rounded">
          <h3 className="font-medium mb-2">Ресурсы</h3>
          <p className="text-sm">Данные отсутствуют</p>
        </div>
      </div>
    </div>
  );
};

export default ResourceTracker;