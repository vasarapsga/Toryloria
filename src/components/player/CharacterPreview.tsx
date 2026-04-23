import { UserCharacter } from '../../types';
import { CLOTHING_ITEMS } from '../../constants';

interface CharacterPreviewProps {
  character: UserCharacter;
  className?: string;
  showShadow?: boolean;
}

export default function CharacterPreview({ character, className = "w-48 h-48", showShadow = true }: CharacterPreviewProps) {
  const hat = CLOTHING_ITEMS.find(i => i.id === character.equipped.hat);
  const shirt = CLOTHING_ITEMS.find(i => i.id === character.equipped.shirt);
  const pants = CLOTHING_ITEMS.find(i => i.id === character.equipped.pants);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Shadow */}
      {showShadow && (
        <div className="absolute bottom-0 w-3/4 h-4 bg-black/20 rounded-full blur-md" />
      )}
      
      {/* Body */}
      <div 
        className="w-full h-full rounded-2xl relative overflow-hidden shadow-inner flex flex-col items-center justify-center border-4 border-black/10"
        style={{ backgroundColor: character.bodyColor, transform: `scale(${character.size})` }}
      >
        {/* Face */}
        <div className="absolute top-1/4 flex gap-4 w-full justify-center">
            <div className="w-5 h-5 bg-black/80 rounded-full" />
            <div className="w-5 h-5 bg-black/80 rounded-full" />
        </div>
        <div className="absolute top-[48%] w-10 h-2 bg-black/80 rounded-full blur-[1px]" />

        {/* Clothing Layers */}
        {shirt && (
          <div 
             className="absolute bottom-0 w-full h-[60%] border-t-[6px] border-black/20" 
             style={{ backgroundColor: shirt.color }} 
          />
        )}
        {pants && (
           <div 
             className="absolute bottom-0 w-full h-[30%] border-t-[6px] border-black/20" 
             style={{ backgroundColor: pants.color }} 
           />
        )}
      </div>

      {/* Hat Layer (Outside/Top of head) */}
      {hat && (
        <div 
          className="absolute top-[-5%] w-3/4 h-1/4 rounded-t-full shadow-2xl border-b-[6px] border-black/30"
          style={{ 
            backgroundColor: hat.color, 
            transform: `scale(${character.size}) translateY(-10%)`,
            zIndex: 10
          }}
        />
      )}
      
      {/* Nickname Tag */}
      <div className="absolute top-[-40px] left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white whitespace-nowrap">
        {character.nickname}
      </div>
    </div>
  );
}
