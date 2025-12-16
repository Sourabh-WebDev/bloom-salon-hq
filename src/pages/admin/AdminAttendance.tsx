import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Clock, Plus, Edit2, TrendingUp, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

interface AttendanceRecord {
  id: string;
  staffName: string;
  date: string;
  timeIn: string;
  timeOut: string;
  totalHours: string;
}

const AdminAttendance = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([
    {
      id: "1",
      staffName: "Sarah Johnson",
      date: "2024-01-15",
      timeIn: "09:00",
      timeOut: "18:00",
      totalHours: "9:00"
    },
    {
      id: "2",
      staffName: "Mike Chen",
      date: "2024-01-15",
      timeIn: "10:00",
      timeOut: "19:00",
      totalHours: "9:00"
    }
  ]);

  const [formData, setFormData] = useState({
    staffName: "",
    date: "",
    timeIn: "",
    timeOut: ""
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const calculateHours = (timeIn: string, timeOut: string) => {
    if (!timeIn || !timeOut) return "0:00";
    const [inHour, inMin] = timeIn.split(":").map(Number);
    const [outHour, outMin] = timeOut.split(":").map(Number);
    const totalMinutes = (outHour * 60 + outMin) - (inHour * 60 + inMin);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const totalHours = calculateHours(formData.timeIn, formData.timeOut);
    
    if (editingId) {
      setRecords(prev => prev.map(record => 
        record.id === editingId 
          ? { ...record, ...formData, totalHours }
          : record
      ));
      toast.success("Attendance updated successfully!");
    } else {
      const newRecord: AttendanceRecord = {
        id: Date.now().toString(),
        ...formData,
        totalHours
      };
      setRecords(prev => [newRecord, ...prev]);
      toast.success("Attendance added successfully!");
    }

    setFormData({ staffName: "", date: "", timeIn: "", timeOut: "" });
    setEditingId(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (record: AttendanceRecord) => {
    setFormData({
      staffName: record.staffName,
      date: record.date,
      timeIn: record.timeIn,
      timeOut: record.timeOut
    });
    setEditingId(record.id);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({ staffName: "", date: "", timeIn: "", timeOut: "" });
    setEditingId(null);
  };

  const attendanceStats = useMemo(() => {
    const staffStats = records.reduce((acc, record) => {
      if (!acc[record.staffName]) {
        acc[record.staffName] = { present: 0, total: 0 };
      }
      acc[record.staffName].present += 1;
      acc[record.staffName].total += 1;
      return acc;
    }, {} as Record<string, { present: number; total: number }>);

    const workingDays = 22; // Assume 22 working days per month
    return Object.entries(staffStats).map(([name, stats]) => ({
      name,
      attendance: Math.round((stats.present / workingDays) * 100),
      present: stats.present,
      absent: workingDays - stats.present
    }));
  }, [records]);

  const chartColors = ['#e11d48', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

  return (
    <AdminLayout title="Staff Attendance" subtitle="Manage staff attendance records">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Staff</p>
                  <p className="text-2xl font-bold">{attendanceStats.length}</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Attendance</p>
                  <p className="text-2xl font-bold">
                    {attendanceStats.length > 0 
                      ? Math.round(attendanceStats.reduce((sum, s) => sum + s.attendance, 0) / attendanceStats.length)
                      : 0}%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Perfect Attendance</p>
                  <p className="text-2xl font-bold">
                    {attendanceStats.filter(s => s.attendance === 100).length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Staff Attendance %</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={attendanceStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="attendance" fill="#e11d48" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attendance Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={attendanceStats}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="attendance"
                    label={({ name, attendance }) => `${name}: ${attendance}%`}
                  >
                    {attendanceStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        {/* Attendance Management */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <span className="text-lg font-medium">Attendance Records</span>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Attendance
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit" : "Add"} Attendance</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="staffName">Staff Name</Label>
                  <Input
                    id="staffName"
                    value={formData.staffName}
                    onChange={(e) => setFormData(prev => ({ ...prev, staffName: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="timeIn">Time In</Label>
                    <Input
                      id="timeIn"
                      type="time"
                      value={formData.timeIn}
                      onChange={(e) => setFormData(prev => ({ ...prev, timeIn: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="timeOut">Time Out</Label>
                    <Input
                      id="timeOut"
                      type="time"
                      value={formData.timeOut}
                      onChange={(e) => setFormData(prev => ({ ...prev, timeOut: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingId ? "Update" : "Add"} Attendance
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Staff Name</th>
                    <th className="text-left py-3 px-4 font-medium">Date</th>
                    <th className="text-left py-3 px-4 font-medium">Time In</th>
                    <th className="text-left py-3 px-4 font-medium">Time Out</th>
                    <th className="text-left py-3 px-4 font-medium">Total Hours</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, index) => (
                    <motion.tr
                      key={record.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="border-b hover:bg-secondary/30"
                    >
                      <td className="py-4 px-4 font-medium">{record.staffName}</td>
                      <td className="py-4 px-4">{record.date}</td>
                      <td className="py-4 px-4">{record.timeIn}</td>
                      <td className="py-4 px-4">{record.timeOut}</td>
                      <td className="py-4 px-4 font-medium">{record.totalHours}</td>
                      <td className="py-4 px-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(record)}
                          className="flex items-center gap-1"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminAttendance;