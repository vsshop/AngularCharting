using Microsoft.AspNetCore.SignalR;
using Project26.Models;

namespace Project26.Hubs
{
    public class ChartHub : Hub
    {
        public async Task BroadcastChartData(List<ChartModel> data) =>
        await Clients.All.SendAsync("broadcastchartdata", data);
    }
}
