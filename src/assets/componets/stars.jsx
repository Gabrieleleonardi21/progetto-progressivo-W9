// Mostra 5 stelle.
// - Senza onSelect: sola lettura (per il voto medio).
// - Con onSelect: stelle cliccabili, usate come input del voto nel form.
function Stars({ value, onSelect }) {
  const stelle = [1, 2, 3, 4, 5];

  // Stella piena se il suo indice rientra nel voto, altrimenti vuota.
  function simbolo(n) {
    if (n <= value) return "★";
    return "☆";
  }

  // Sola lettura: niente handler → semplici span statici.
  if (!onSelect) {
    return (
      <span className="text-warning" aria-label={`Voto ${value} su 5`}>
        {stelle.map((n) => (
          <span key={n}>{simbolo(n)}</span>
        ))}
      </span>
    );
  }

  // Input voto: ogni stella è un bottone accessibile.
  return (
    <span className="text-warning fs-4">
      {stelle.map((n) => (
        <button
          key={n}
          type="button"
          className="btn btn-link p-0 text-warning text-decoration-none lh-1"
          aria-label={`Assegna ${n} stelle`}
          onClick={() => onSelect(n)}
        >
          {simbolo(n)}
        </button>
      ))}
    </span>
  );
}

export default Stars;
