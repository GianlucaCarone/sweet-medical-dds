import Skeleton from "@mui/material/Skeleton";
import '../PerfilMedico.css';

export default function PerfilMedicoSkeleton() {
  return (
    <main className="container-perfil">

      {/* Cabecera skeleton */}
      <header className="perfil-card mb-4">
        <div className="row g-4">

          {/* Columna 1: Avatar + nombre */}
          <div className="col-12 col-lg-4 col-border-right d-flex align-items-center px-4 py-3">
            <div className="d-flex align-items-center gap-3 w-100">
              <Skeleton variant="circular" width={64} height={64} />
              <div style={{ flex: 1 }}>
                <Skeleton width="70%" height={28} />
                <Skeleton width="40%" height={16} />
              </div>
            </div>
          </div>

          {/* Columna 2: Datos personales */}
          <div className="col-12 col-lg-4 col-border-right px-4 py-3">
            <Skeleton width="50%" height={22} sx={{ mb: 2 }} />
            <Skeleton width="80%" height={18} />
            <Skeleton width="60%" height={18} />
            <Skeleton width="70%" height={18} />
            <Skeleton width="40%" height={18} />
          </div>

          {/* Columna 3: Seguridad */}
          <div className="col-12 col-lg-4 px-4 py-3">
            <Skeleton width="50%" height={22} sx={{ mb: 2 }} />
            <Skeleton width="90%" height={40} sx={{ borderRadius: '8px' }} />
            <Skeleton width="90%" height={40} sx={{ borderRadius: '8px', mt: 1 }} />
          </div>

        </div>
      </header>

      {/* Tabs skeleton */}
      <section className="perfil-card p-0 overflow-hidden mb-4">
        <nav className="tabs-header-container">
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ padding: '16px 24px' }}>
              <Skeleton width={90} height={20} />
            </div>
          ))}
        </nav>

        <article className="tab-content-container p-4">
          <div className="row g-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="col-12 col-md-4">
                <div className="servicio-card">
                  <Skeleton width="60%" height={24} />
                  <Skeleton width="40%" height={18} sx={{ mt: 1 }} />
                  <Skeleton width="80%" height={18} sx={{ mt: 1 }} />
                  <Skeleton variant="rounded" width="100%" height={36} sx={{ mt: 2, borderRadius: '8px' }} />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

    </main>
  );
}
