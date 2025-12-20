type PriceCardProps = {
  rate: number;
  currency: string;
  name: string;
};

export const PriceCard = ({ rate, currency, name }: PriceCardProps) => {
  const getFlag = () => {
    switch (currency) {
      case 'USD':
        return '🇺🇸';
      case 'EUR':
        return '🇪🇺';
      case 'MLC':
        return '🇨🇺';
      default:
        return '';
    }
  };

  const getColor = () => {
    switch (currency) {
      case 'USD':
        return 'text-green-600';
      case 'EUR':
        return 'text-blue-600';
      case 'MLC':
        return 'text-purple-600';
      default:
        return '';
    }
  };
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-700">{currency}</h2>
        <span className="text-4xl">{getFlag()}</span>
      </div>
      <div className="text-center">
        <p className="text-gray-500 text-sm mb-1">{name}</p>
        <p className={`text-5xl font-bold ${getColor()}`}>{rate}</p>
        <p className="text-gray-400 text-sm mt-2">CUP</p>
      </div>
    </div>
  );
};
