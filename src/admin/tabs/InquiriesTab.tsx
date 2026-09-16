import React, { useState, useMemo } from 'react';
import { Inquiry } from '../../types';
import { markInquiryRead, deleteInquiry } from '../../lib/cmsData';
import {
  Search,
  Filter,
  Trash2,
  CheckCircle,
  Clock,
  Mail,
  Phone,
  Building,
  DollarSign,
  MessageSquare,
  ExternalLink,
  Download,
  AlertCircle,
  X,
  MessageCircle,
} from 'lucide-react';

interface InquiriesTabProps {
  inquiries: Inquiry[];
  onRefresh: () => void;
  selectedInquiry: Inquiry | null;
  onSelectInquiry: (inquiry: Inquiry | null) => void;
}

export const InquiriesTab: React.FC<InquiriesTabProps> = ({
  inquiries,
  onRefresh,
  selectedInquiry,
  onSelectInquiry,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  // Extract unique services from inquiries for filter dropdown
  const uniqueServices = useMemo(() => {
    const s = new Set<string>();
    inquiries.forEach((i) => {
      if (i.service) s.add(i.service);
    });
    return Array.from(s);
  }, [inquiries]);

  // Filter & search
  const filtered = useMemo(() => {
    return inquiries
      .filter((inq) => {
        // Status filter
        const isUnread = !inq.read || inq.status === 'new';
        if (statusFilter === 'unread' && !isUnread) return false;
        if (statusFilter === 'read' && isUnread) return false;

        // Service filter
        if (serviceFilter !== 'all' && inq.service !== serviceFilter) return false;

        // Search term
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchName = inq.name?.toLowerCase().includes(q);
          const matchEmail = inq.email?.toLowerCase().includes(q);
          const matchPhone = inq.phone?.toLowerCase().includes(q);
          const matchCompany = inq.company?.toLowerCase().includes(q);
          const matchMsg = inq.message?.toLowerCase().includes(q);
          return matchName || matchEmail || matchPhone || matchCompany || matchMsg;
        }

        return true;
      })
      .sort((a, b) => {
        const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return sortBy === 'newest' ? timeB - timeA : timeA - timeB;
      });
  }, [inquiries, searchTerm, statusFilter, serviceFilter, sortBy]);

  const handleToggleRead = async (inquiry: Inquiry, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newRead = !inquiry.read;
    setLoadingAction(inquiry.id);
    await markInquiryRead(inquiry.id, newRead);
    setLoadingAction(null);
    onRefresh();
    if (selectedInquiry?.id === inquiry.id) {
      onSelectInquiry({ ...selectedInquiry, read: newRead, status: newRead ? 'reviewed' : 'new' });
    }
  };

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Are you sure you want to permanently delete this client inquiry?')) {
      return;
    }
    setLoadingAction(id);
    await deleteInquiry(id);
    setLoadingAction(null);
    if (selectedInquiry?.id === id) {
      onSelectInquiry(null);
    }
    onRefresh();
  };

  const exportCSV = () => {
    if (inquiries.length === 0) return;
    const headers = ['ID', 'Date', 'Name', 'Email', 'Phone', 'Company', 'Service', 'Budget', 'Status', 'Message'];
    const rows = inquiries.map((i) => [
      `"${i.id}"`,
      `"${i.created_at || ''}"`,
      `"${(i.name || '').replace(/"/g, '""')}"`,
      `"${(i.email || '').replace(/"/g, '""')}"`,
      `"${(i.phone || '').replace(/"/g, '""')}"`,
      `"${(i.company || '').replace(/"/g, '""')}"`,
      `"${(i.service || '').replace(/"/g, '""')}"`,
      `"${(i.budget || '').replace(/"/g, '""')}"`,
      `"${i.read ? 'read' : 'new'}"`,
      `"${(i.message || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `amaas_inquiries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            Inquiries Management
          </h2>
          <p className="text-xs sm:text-sm text-[#94a3b8] mt-1">
            Review, filter, respond to, and manage client consultation requests.
          </p>
        </div>

        <button
          onClick={exportCSV}
          disabled={inquiries.length === 0}
          className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-medium text-[#cbd5e1] hover:text-white flex items-center gap-2 transition-colors cursor-pointer self-start md:self-auto disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Download className="w-3.5 h-3.5 text-[#38bdf8]" />
          <span>Export Inquiries CSV</span>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="p-4 rounded-2xl bg-[#08101d] border border-white/[0.08] flex flex-col lg:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#64748b] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, phone, company, or message text..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#05090e] border border-white/[0.08] text-sm text-white placeholder-[#475569] focus:outline-none focus:border-[#38bdf8]"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#64748b] hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap sm:flex-nowrap gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'unread' | 'read')}
            className="px-3 py-2 rounded-xl bg-[#05090e] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#38bdf8]"
          >
            <option value="all">All Statuses ({inquiries.length})</option>
            <option value="unread">New / Unread ({inquiries.filter((i) => !i.read).length})</option>
            <option value="read">Reviewed / Read ({inquiries.filter((i) => i.read).length})</option>
          </select>

          {uniqueServices.length > 0 && (
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#05090e] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#38bdf8]"
            >
              <option value="all">All Services</option>
              {uniqueServices.map((srv) => (
                <option key={srv} value={srv}>
                  {srv}
                </option>
              ))}
            </select>
          )}

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
            className="px-3 py-2 rounded-xl bg-[#05090e] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#38bdf8]"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Inquiries Table / Cards */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#08101d] border border-white/[0.08] text-sm text-[#64748b]">
          <Clock className="w-8 h-8 mx-auto mb-2 text-[#475569]" />
          No inquiries matching your selected search or filter criteria.
        </div>
      ) : (
        <div className="rounded-2xl bg-[#08101d] border border-white/[0.08] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#05090e]/80 text-[#94a3b8] uppercase tracking-wider font-mono text-[11px] border-b border-white/[0.06]">
                <tr>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Client</th>
                  <th className="py-3.5 px-4">Service & Budget</th>
                  <th className="py-3.5 px-4">Message Snippet</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filtered.map((inq) => {
                  const isUnread = !inq.read || inq.status === 'new';
                  return (
                    <tr
                      key={inq.id}
                      onClick={() => onSelectInquiry(inq)}
                      className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono ${
                            isUnread
                              ? 'bg-[#38bdf8]/15 text-[#7dd3fc] border border-[#38bdf8]/30 font-medium'
                              : 'bg-white/[0.05] text-[#94a3b8] border border-white/[0.06]'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isUnread ? 'bg-[#38bdf8]' : 'bg-[#64748b]'
                            }`}
                          />
                          {isUnread ? 'New' : 'Reviewed'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-white">{inq.name}</div>
                        <div className="text-xs text-[#94a3b8] flex items-center gap-2">
                          <span>{inq.email}</span>
                          {inq.phone && <span>• {inq.phone}</span>}
                        </div>
                        {inq.company && (
                          <div className="text-[11px] text-[#64748b]">{inq.company}</div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-mono text-xs text-[#e2e8f0]">
                          {inq.service || 'General'}
                        </div>
                        {inq.budget && (
                          <div className="text-[11px] font-mono text-[#38bdf8]">
                            {inq.budget}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 max-w-xs truncate text-[#94a3b8] text-xs">
                        {inq.message}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-xs text-[#64748b] font-mono">
                        {inq.created_at
                          ? new Date(inq.created_at).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : '—'}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            title={isUnread ? 'Mark as Reviewed' : 'Mark as Unread'}
                            onClick={(e) => handleToggleRead(inq, e)}
                            className="p-1.5 rounded-lg text-[#94a3b8] hover:text-[#38bdf8] hover:bg-white/[0.05] transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            title="Delete Inquiry"
                            onClick={(e) => handleDelete(inq.id, e)}
                            className="p-1.5 rounded-lg text-[#94a3b8] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inquiry Details Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#08101d] border border-white/[0.1] rounded-2xl p-6 sm:p-8 shadow-2xl relative space-y-6 text-[#f1f5f9]">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white font-display">
                    {selectedInquiry.name}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                      !selectedInquiry.read
                        ? 'bg-[#38bdf8]/15 text-[#7dd3fc] border border-[#38bdf8]/30'
                        : 'bg-white/[0.05] text-[#94a3b8]'
                    }`}
                  >
                    {!selectedInquiry.read ? 'New Inquiry' : 'Reviewed'}
                  </span>
                </div>
                <div className="text-xs text-[#94a3b8] mt-1 font-mono">
                  Received:{' '}
                  {selectedInquiry.created_at
                    ? new Date(selectedInquiry.created_at).toLocaleString()
                    : 'Recent'}
                </div>
              </div>

              <button
                onClick={() => onSelectInquiry(null)}
                className="p-2 rounded-xl text-[#94a3b8] hover:text-white hover:bg-white/[0.05] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Client Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#05090e] border border-white/[0.06] space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#64748b]">Email Address</span>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white">{selectedInquiry.email}</span>
                  <a
                    href={`mailto:${selectedInquiry.email}`}
                    className="p-1 rounded bg-[#38bdf8]/10 text-[#38bdf8] hover:bg-[#38bdf8]/20"
                    title="Send Email"
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#05090e] border border-white/[0.06] space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#64748b]">Phone Number</span>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white">{selectedInquiry.phone || '—'}</span>
                  {selectedInquiry.phone && (
                    <div className="flex items-center gap-1">
                      <a
                        href={`tel:${selectedInquiry.phone}`}
                        className="p-1 rounded bg-[#38bdf8]/10 text-[#38bdf8] hover:bg-[#38bdf8]/20"
                        title="Call Phone"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={`https://wa.me/${selectedInquiry.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#05090e] border border-white/[0.06] space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#64748b]">Company / Organization</span>
                <div className="font-medium text-white">{selectedInquiry.company || 'Not Specified'}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#05090e] border border-white/[0.06] space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#64748b]">Service & Budget</span>
                <div className="font-medium text-[#38bdf8]">
                  {selectedInquiry.service || 'General'}
                  {selectedInquiry.budget && ` • ${selectedInquiry.budget}`}
                </div>
              </div>
            </div>

            {/* Message Body */}
            <div>
              <span className="block text-xs font-mono uppercase text-[#64748b] mb-2">
                Client Project Message
              </span>
              <div className="p-4 rounded-xl bg-[#05090e] border border-white/[0.06] text-sm leading-relaxed text-[#cbd5e1] whitespace-pre-wrap">
                {selectedInquiry.message}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/[0.08]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleRead(selectedInquiry)}
                  className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-medium text-white flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span>{selectedInquiry.read ? 'Mark as Unread' : 'Mark as Reviewed'}</span>
                </button>

                <button
                  onClick={() => handleDelete(selectedInquiry.id)}
                  className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-xs font-medium text-red-300 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedInquiry.email}?subject=Regarding your AMAAS inquiry`}
                  className="px-4 py-2 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-xs font-medium text-white flex items-center gap-2 transition-colors cursor-pointer shadow-md"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
