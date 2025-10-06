import { Bold } from "lucide-react";
import { useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Données factices pour les statistiques
const fakeStats = {
  statutPaie: "Non payé",
};

const PropertiesDashboard = ({ properties, todayCount }) => {

  const now = new Date();
  const currentYear = now.getFullYear();

  const user = useSelector((state) => state.user);

  const getPropertiesPerMonth = (properties) => {
    const months = [
      "Jan", "Fév", "Mar", "Avr", "Mai", "Juin",
      "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"
    ];

    const monthlyCount = months.map((month) => ({
      mois: month,
      proprietes: 0,
    }));

    properties.forEach((property) => {
      if (property.created_at) {
        const date = new Date(property.created_at);
        const monthIndex = date.getMonth();
        const year = date.getFullYear();

        // Only count properties from the current year
        if (year === currentYear) {
          monthlyCount[monthIndex].proprietes += 1;
        }
      }
    });

    return monthlyCount;
  };

  const dataForChart = getPropertiesPerMonth(properties);

  const max = Math.max(...dataForChart.map(d => d.proprietes));
  const step = Math.ceil(max / 5); // 5 steps on Y-axis
  const ticks = Array.from({ length: 6 }, (_, i) => i * step);

  const currentMonthIndex = now.getMonth(); // 0 = Jan, 9 = Oct, etc.
  const propertiesThisMonth = dataForChart[currentMonthIndex]?.proprietes || 0;


  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "short", // Use short month name
    day: "2-digit", // Use 2-digit day format
    timeZone: "Indian/Antananarivo",
  }).format(new Date(user.created_at));


  return (
    <div
      style={{
        maxWidth: 600,
        margin: "auto",
        background: "#fff",
        borderRadius: 20,
        boxShadow: "4px 10px 15px rgba(0,0,0,0.1)",
        padding: "20px 25px",
        outline: "none",
      }}
    >
      {/* Titre */}
      <h6
        style={{
          textAlign: "center",
          fontSize: "1.05rem",
          marginBottom: 15,
          color: "#111",
          fontWeight: 530,
        }}
      >
        Aperçu de votre activité {currentYear}
      </h6>

      {/* Bloc d'informations */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px 20px",
          marginBottom: 20,
          fontSize: "0.9rem",
        }}
      >
        <div>
          <strong>Total de propriétés :</strong> {properties.length}
        </div>
        <div>
          <strong>Compte créé le :</strong> {formattedDate}
        </div>
        <strong className="font-weight-bold">Annonces Créée:</strong>
        <br />
        <div>
          <strong>Ce mois-ci :</strong> {propertiesThisMonth}
        </div>
        <div>
          <strong>Aujourd'hui :</strong>{"  "}
          <span
            style={{
              color: "#22c55e",
              fontWeight: 600,
            }}
          >
            {todayCount}
          </span>
        </div>
      </div>

      {/* Graphique */}
      <div style={{ width: "100%", height: 250 }}>
        <ResponsiveContainer>
          <BarChart
            data={dataForChart}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mois" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} width={40} ticks={ticks} domain={[0, (max + 20)]} tick={{ fontSize: 12 }} />

            <Tooltip
              formatter={(value) => [`${value} propriétés`, "Nombre"]}
              labelFormatter={(label) => `Mois : ${label}`}
            />
            <Bar dataKey="proprietes" fill="#7cbd1e" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PropertiesDashboard;
