import { PlayerCharacteristics } from "@/types/game";

interface PlayerStatusProps {
  playerData?: PlayerCharacteristics;
}

const PlayerStatus = ({ playerData }: PlayerStatusProps) => {
  if (!playerData) {
    return <div>Загрузка данных игрока...</div>;
  }

  return (
    <div className="bg-bunker-accent rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Статус игрока</h2>
      <div className="space-y-4">
        <div className="bg-bunker-bg p-3 rounded">
          <h3 className="font-medium mb-2">Характеристики</h3>
          <ul className="space-y-2">
            <li>Имя: {playerData.name}</li>
            <li>Пол: {playerData.gender}</li>
            <li>Профессия: {playerData.profession}</li>
            <li>Опыт работы: {playerData.professionExperience}</li>
            <li>Возраст: {playerData.age}</li>
            <li>Здоровье: {playerData.health}</li>
            <li>Хобби: {playerData.hobby}</li>
            <li>Опыт хобби: {playerData.hobbyExperience}</li>
            <li>Образование: {playerData.education}</li>
            <li>Фобия: {playerData.phobia}</li>
            <li>Особая способность: {playerData.specialAbility}</li>
          </ul>
        </div>
        
        <div className="bg-bunker-bg p-3 rounded">
          <h3 className="font-medium mb-2">Инвентарь</h3>
          <p>{playerData.bagItem || "Рюкзак пуст"}</p>
        </div>
      </div>
    </div>
  );
};

export default PlayerStatus;