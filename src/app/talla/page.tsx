import { processProvinceRatesImage } from '../actions';

export default async function Talla() {
  const result = await processProvinceRatesImage();
  console.log(result);

  return (
    <div>
      <h1>Talla</h1>

      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}
