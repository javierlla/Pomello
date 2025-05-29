import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

/**
 * SessionChart is a React functional component that visualizes session data using Chart.js.
 * It displays three charts: a doughnut chart for completed vs interrupted sessions,
 * a bar chart for focus and break durations per session, and a line chart for
 * sessions per day over the current week.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.data - The data used for generating the charts. Contains
 * session statistics such as total sessions, completed sessions, interrupted sessions,
 * and individual session details.
 *
 * If no data is available or if totalSessions is zero, a message is displayed
 * indicating that no statistics are available.
 */

const SessionChart = ({ data }) => {
  const doughnutChartRef = useRef(null);
  const barChartRef = useRef(null);
  const weeklyChartRef = useRef(null);

  useEffect(() => {
    const sessions = data?.sessions ?? [];
    const completedSessions = data?.completedSessions ?? 0;
    const interruptedSessions = data?.interruptedSessions ?? 0;

    const destroyIfExists = (ref) => {
      if (ref.current?.chartInstance) {
        ref.current.chartInstance.destroy();
      }
    };

    destroyIfExists(doughnutChartRef);
    destroyIfExists(barChartRef);
    destroyIfExists(weeklyChartRef);

    // Doughnut Chart
    const doughnutCtx = doughnutChartRef.current.getContext("2d");
    doughnutChartRef.current.chartInstance = new Chart(doughnutCtx, {
      type: "pie",
      data: {
        labels: ["Completed", "Interrupted"],
        datasets: [
          {
            label: "Sessions",
            data: [completedSessions, interruptedSessions],
            backgroundColor: ["#ff6384", "#fcab51"],
            borderColor: ["#ff6384", "#fcab51"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            labels: { color: "white", font: { size: 14 } },
          },
        },
      },
    });

    // Bar Chart
    const barCtx = barChartRef.current.getContext("2d");
    const sessionLabels = sessions.map((_, i) => `Session ${i + 1}`);
    const focusDurations = sessions.map((s) => s.focusDuration ?? 0);
    const breakDurations = sessions.map((s) => s.breakDuration ?? 0);

    barChartRef.current.chartInstance = new Chart(barCtx, {
      type: "bar",
      data: {
        labels: sessionLabels.length ? sessionLabels : ["No stats yet"],
        datasets: [
          {
            label: "Focus Duration",
            data: focusDurations.length ? focusDurations : [0],
            backgroundColor: "#ff6384",
          },
          {
            label: "Break Duration",
            data: breakDurations.length ? breakDurations : [0],
            backgroundColor: "#fcab51",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            labels: { color: "white", font: { size: 14 } },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Focus sessions",
              color: "white",
              font: { size: 14 },
            },
            ticks: { color: "white" },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Duration (min)",
              color: "white",
              font: { size: 14 },
            },
            ticks: { color: "white" },
          },
        },
      },
    });

    // Weekly Chart
    const weeklyCtx = weeklyChartRef.current.getContext("2d");
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1));
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const daysOfWeek = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const weeklyData = Array(7).fill(0);
    sessions.forEach((session) => {
      const date = new Date(session.createdAt);
      if (date >= startOfWeek && date <= endOfWeek) {
        const day = (date.getDay() + 6) % 7;
        weeklyData[day]++;
      }
    });

    weeklyChartRef.current.chartInstance = new Chart(weeklyCtx, {
      type: "line",
      data: {
        labels: daysOfWeek,
        datasets: [
          {
            label: "Focus per day",
            data: weeklyData,
            backgroundColor: "#ff6384",
            borderColor: "#ff6384",
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            labels: { color: "white", font: { size: 14 } },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Day of the Week",
              color: "white",
              font: { size: 14 },
            },
            ticks: { color: "white" },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Number of Sessions",
              color: "white",
              font: { size: 14 },
            },
            ticks: { color: "white" },
          },
        },
      },
    });
  }, [data]);

  return (
    <section className="bg-gray-800 h-full">
      <section className="p-4 pt-18 ml-64">
        <h1 className="text-2xl font-bold text-white/80 mb-8 pl-24 pt-2">
          Stats
        </h1>
        <p className="text-white/80 mb-8 pl-24 text-lg">
          These stats show the pomodoros you’ve completed and the ones that were
          interrupted. You can see your progress clearly through the numbers and
          bar charts that track the duration of each session. <br /> Keep it up — every
          session, completed or interrupted, is a step forward toward your
          goals!
        </p>
        <div className="flex flex-col gap-8 items-center">
          {[doughnutChartRef, barChartRef, weeklyChartRef].map((ref, index) => (
            <div
              key={index}
              className="bg-gray-500 rounded shadow p-4 w-[700px] h-[350px] flex items-center justify-center relative"
            >
              <canvas ref={ref} className="w-full h-full"></canvas>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
};

export default SessionChart;
