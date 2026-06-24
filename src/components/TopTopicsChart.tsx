import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { RepeatedQuestion, TopicMetric } from "../types/dashboard";

interface TopTopicsChartProps {
  topics: TopicMetric[];
  questions: RepeatedQuestion[];
}

export function TopTopicsChart({ topics, questions }: TopTopicsChartProps) {
  return (
    <section className="panel topics-panel">
      <div className="panel-header">
        <div>
          <h2>Top topics and repeated questions</h2>
          <p>Most asked categories and repeated questions for the selected month.</p>
        </div>
      </div>
      <div className="topics-layout">
        <div className="chart-box">
          <ResponsiveContainer width="100%" height={290}>
            <BarChart data={topics} layout="vertical" margin={{ top: 4, right: 18, left: 12, bottom: 4 }}>
              <CartesianGrid horizontal={false} stroke="#e6eaf2" />
              <XAxis type="number" hide />
              <YAxis dataKey="category" type="category" width={96} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => [`${value} questions`, "Volume"]} cursor={{ fill: "#f4f6fa" }} />
              <Bar dataKey="questions" fill="#2563eb" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="question-list">
          {questions.slice(0, 6).map((item, index) => (
            <article key={item.question}>
              <span>{index + 1}</span>
              <div>
                <strong>{item.question}</strong>
                <p>{item.category} · {item.count} repeats</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
