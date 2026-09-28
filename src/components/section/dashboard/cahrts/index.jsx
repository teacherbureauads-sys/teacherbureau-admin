"use client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  Legend,
  Line,
} from "recharts";

const MainChart = () => {
  const data = [
    {
      year: "2016",
      Iphone: 4000,
      Samsung: 2400,
    },
    {
      year: "2017",
      Iphone: 3000,
      Samsung: 1398,
    },
    {
      year: "2018",
      Iphone: 2000,
      Samsung: 9800,
    },
    {
      year: "2019",
      Iphone: 2780,
      Samsung: 3908,
    },
    {
      year: "2020",
      Iphone: 1890,
      Samsung: 4800,
    },
    {
      year: "2021",
      Iphone: 2390,
      Samsung: 3800,
    },
    {
      year: "2022",
      Iphone: 3490,
      Samsung: 4300,
    },
  ];
  const lineChartData = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];
  return (
    <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-4 text-[10px]">
      {/* chart 1 */}
      <div className="w-full aspect-video  flex flex-col gap-5 bg-white shadow-sm rounded-lg p-4">
        <div className=" border-b border-gray-200 pb-2">
          <h4 className="text-[14px] font-medium text-gray-900">
            Monthly Enquiry → Order Conversion
          </h4>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            width={730}
            height={250}
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="Iphone"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorUv)"
            />
            <Area
              type="monotone"
              dataKey="Samsung"
              stroke="#82ca9d"
              fillOpacity={1}
              fill="url(#colorPv)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* chart 2 */}

      <div className="w-full aspect-video  flex flex-col gap-5 bg-white shadow-sm rounded-lg p-4">
        <div className=" border-b border-gray-200 pb-2">
          <h4 className="text-[14px] font-medium text-gray-900">
            Business (Purchase)
          </h4>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart width="100%" height="100%" data={lineChartData}>
            <Line type="monotone" dataKey="pv" stroke="#8884d8" />
            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
            <CartesianGrid strokeDasharray="5 5" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* chart 3 */}

      {/* <div className="w-full aspect-video  flex flex-col gap-5 bg-white shadow-sm rounded-lg p-4">
        <div className=" border-b border-gray-200 pb-2">
          <h4 className="text-[14px] font-medium text-gray-500">
            Business (Purchase)
          </h4>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart width="100%" height="100%" data={lineChartData}>
            <Line type="monotone" dataKey="pv" stroke="#8884d8" />
            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
            <CartesianGrid strokeDasharray="5 5" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
          </LineChart>
        </ResponsiveContainer>
      </div> */}

      {/* chart 4 */}

      {/* <div className="w-full aspect-video  flex flex-col gap-5 bg-white shadow-sm rounded-lg p-4">
        <div className=" border-b border-gray-200 pb-2">
          <h4 className="text-[14px] font-medium text-gray-500">
            Monthly Enquiry → Order Conversion
          </h4>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            width={730}
            height={250}
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="Iphone"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorUv)"
            />
            <Area
              type="monotone"
              dataKey="Samsung"
              stroke="#82ca9d"
              fillOpacity={1}
              fill="url(#colorPv)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div> */}
    </div>
  );
};

export default MainChart;
