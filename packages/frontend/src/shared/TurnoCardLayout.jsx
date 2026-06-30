import CardBase from './CardBase/CardBase';
import CardDivider from '../components/cards/CardTurno/CardDivider';
import TurnoCardHeader from '../components/cards/CardTurno/TurnoCardHeader';

export default function TurnoCardLayout({ turno, especialidades, practicas, children }) {
  return (
    <CardBase>
      <CardDivider.Top>
        <TurnoCardHeader turno={turno} especialidades={especialidades} practicas={practicas} />
      </CardDivider.Top>
      <CardDivider.Bottom>
        {children}
      </CardDivider.Bottom>
    </CardBase>
  );
}
