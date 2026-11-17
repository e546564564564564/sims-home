// L'app si usa solo in orizzontale: in verticale mostra un invito a ruotare il telefono.
export default function RotateHint() {
  return (
    <div className="ruota">
      <div>
        <div className="ruota-icona">↻</div>
        Ruota il telefono in orizzontale
      </div>
    </div>
  )
}
