import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ArrowLeft, 
  UserPlus, 
  Power, 
  Search,
  Loader2,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { addUser, updateUserStatus } from '@/lib/usersApi'; 

interface User {
  id: string;
  employeeId: string;
  fullName: string;
  role: 'admin' | 'employee';
  isActive: boolean;
  lastLogin: string;
}

const AdminUsers = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    employeeId: '',
    fullName: '',
    role: 'employee' as 'admin' | 'employee',
  });

  // حماية الصفحة: نطرده للداشبورد لو مو أدمن
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const userData = savedUser ? JSON.parse(savedUser) : null;
    if (!userData || userData.role !== 'admin') {
      toast.error(language === 'ar' ? "عذراً، لا تملك صلاحية الوصول" : "Access Denied");
      navigate('/dashboard');
    }
  }, [navigate, language]);

  // جلب البيانات من السيرفر
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://13.63.154.193:8080/api/users");
        const data = await res.json();
        const formattedUsers = data.map((u: any) => ({
          id: u.userId,
          employeeId: u.userId,
          fullName: u.name,
          role: u.role,
          isActive: u.status === "Active",
          lastLogin: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Never'
        }));
        setUsers(formattedUsers);
      } catch (error) {
        toast.error(language === 'ar' ? "فشل جلب البيانات" : "Fetch failed");
      }
    };
    fetchUsers();
  }, [language]);

  const filteredUsers = users.filter(user => 
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddUser = async () => {
    if (!newUser.employeeId || !newUser.fullName) {
      toast.error(language === 'ar' ? "يرجى تعبئة الحقول" : "Please fill all fields");
      return;
    }
    setIsLoading(true);
    try {
      const result = await addUser({
        userId: newUser.employeeId,
        name: newUser.fullName,
        role: newUser.role
      });
      setUsers([...users, { id: newUser.employeeId, employeeId: newUser.employeeId, fullName: newUser.fullName, role: newUser.role, isActive: true, lastLogin: 'Never' }]);
      setIsAddDialogOpen(false);
      setNewUser({ employeeId: '', fullName: '', role: 'employee' });
      toast.success(`${t('userAdded')}. Pass: ${result.tempPass}`, { duration: 15000 });
    } catch (error: any) {
      toast.error("Error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    try {
      await updateUserStatus(user.employeeId, user.isActive ? 'Inactive' : 'Active');
      setUsers(users.map(u => u.id === userId ? { ...u, isActive: !u.isActive } : u));
      const msg = language === 'ar' ? "تم تحديث الحالة لـ " : "Status updated for ";
      toast.success(msg + user.fullName);
    } catch (error) {
      toast.error("Failed");
    }
  };

  return (
    <div className="min-h-screen bg-background" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* هيدر واحد بس يظهر فوق */}
      <DashboardHeader />

      <main className="p-6 max-w-7xl mx-auto">
        {/* عنوان الصفحة الداخلي */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button size="icon" variant="ghost" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className={`w-5 h-5 ${language === 'ar' ? 'rotate-180' : ''}`} />
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold">{t('userManagement')}</h1>
            </div>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <UserPlus className={`w-5 h-5 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                {t('addUser')}
              </Button>
            </DialogTrigger>
            <DialogContent className={language === 'ar' ? 'text-right' : 'text-left'}>
              <DialogHeader>
                <DialogTitle>{t('addNewUser')}</DialogTitle>
                <DialogDescription>{t('addNewUserDesc')}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>{t('employeeId')}</Label>
                  <Input value={newUser.employeeId} onChange={(e) => setNewUser({ ...newUser, employeeId: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>{t('fullName')}</Label>
                  <Input value={newUser.fullName} onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>{t('role')}</Label>
                  <Select value={newUser.role} onValueChange={(value: any) => setNewUser({ ...newUser, role: value })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employee">{t('employee')}</SelectItem>
                      <SelectItem value="admin">{t('admin')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>{t('cancel')}</Button>
                <Button onClick={handleAddUser} disabled={isLoading}>
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin ml-2" />}
                  {t('addUser')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* شريط البحث */}
        <div className="mb-6">
          <div className="relative w-full max-w-md">
            <Search className={`absolute ${language === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground`} />
            <Input
              placeholder={t('searchUsers')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`${language === 'ar' ? 'pr-10' : 'pl-10'}`}
            />
          </div>
        </div>

        {/* جدول الموظفين */}
        <div className="panel overflow-hidden border rounded-xl bg-card shadow-md">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className={language === 'ar' ? 'text-right' : 'text-left'}>{t('employeeId')}</TableHead>
                <TableHead className={language === 'ar' ? 'text-right' : 'text-left'}>{t('fullName')}</TableHead>
                <TableHead className={language === 'ar' ? 'text-right' : 'text-left'}>{t('role')}</TableHead>
                <TableHead className={language === 'ar' ? 'text-right' : 'text-left'}>{t('status')}</TableHead>
                <TableHead className={language === 'ar' ? 'text-right' : 'text-left'}>{t('lastLogin')}</TableHead>
                <TableHead className={language === 'ar' ? 'text-left' : 'text-right'}>{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-mono">{user.employeeId}</TableCell>
                  <TableCell className="font-medium">{user.fullName}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>{user.role === 'admin' ? t('admin') : t('employee')}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={user.isActive ? 'border-green-500 text-green-500' : 'border-gray-400 text-gray-400'}>
                      {user.isActive ? t('active') : t('inactive')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{user.lastLogin}</TableCell>
                  <TableCell className={language === 'ar' ? 'text-left' : 'text-right'}>
                    <Button size="icon" variant="ghost" onClick={() => handleToggleActive(user.id)}>
                      <Power className={`w-4 h-4 ${user.isActive ? 'text-green-500' : 'text-gray-400'}`} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};

export default AdminUsers;