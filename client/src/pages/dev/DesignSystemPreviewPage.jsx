import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  FiCalendar,
  FiCheck,
  FiDownload,
  FiEdit2,
  FiEye,
  FiHome,
  FiKey,
  FiLayers,
  FiMail,
  FiMoreVertical,
  FiPlus,
  FiPrinter,
  FiSliders,
  FiTrash2,
  FiUser,
  FiUsers,
} from 'react-icons/fi';
import {
  Badge,
  Breadcrumb,
  Button,
  Card,
  ConfirmDialog,
  Dropdown,
  EmptyState,
  ErrorState,
  Input,
  LoadingSpinner,
  Modal,
  PageHeader,
  Pagination,
  SearchInput,
  Select,
  StatCard,
  Table,
  Textarea,
} from '../../components';

const BRAND_SWATCHES = [
  { name: 'Deep Navy', token: '--color-navy', hex: '#101B2D', text: '#FFFFFF', role: 'Primary structural surface, headings, executive sidebar' },
  { name: 'Burnished Gold', token: '--color-gold', hex: '#C8A45D', text: '#101B2D', role: 'Secondary accent, editorial rules, focus rings, key CTAs' },
  { name: 'Warm Ivory', token: '--color-ivory', hex: '#F8F6F0', text: '#101B2D', role: 'Primary canvas background for both public & admin portals' },
  { name: 'Pure White', token: '--color-white', hex: '#FFFFFF', text: '#101B2D', role: 'Elevated cards, modals, table containers, form inputs' },
  { name: 'Executive Slate', token: '--color-slate', hex: '#667085', text: '#FFFFFF', role: 'Muted helper copy, secondary metadata, subtle UI icons' },
];

const SEMANTIC_SWATCHES = [
  { name: 'Success', token: '--color-success', hex: '#127A54', bg: '#ECF7F2' },
  { name: 'Warning', token: '--color-warning', hex: '#9A5B13', bg: '#FEF6E7' },
  { name: 'Danger', token: '--color-danger', hex: '#B42318', bg: '#FEF3F2' },
  { name: 'Info', token: '--color-info', hex: '#1E4E8C', bg: '#EFF5FC' },
  { name: 'Hairline Border', token: '--border-subtle', hex: '#EAE5DA', bg: '#F8F6F0' },
];

const SAMPLE_BOOKINGS = [
  {
    _id: 'bk-1',
    bookingNumber: 'LS-2026-0148',
    guestName: 'Eleanor Vance',
    property: 'The Grand Meridian · Geneva',
    suite: 'Presidential Lake Suite · 401',
    checkIn: '28 Nov 2026',
    nights: 4,
    total: '$4,800.00',
    status: 'confirmed',
  },
  {
    _id: 'bk-2',
    bookingNumber: 'LS-2026-0149',
    guestName: 'Julian Mercer',
    property: 'Maison Lumière · Paris',
    suite: 'Deluxe Terrace King · 209',
    checkIn: '25 Nov 2026',
    nights: 3,
    total: '$2,340.00',
    status: 'checkedIn',
  },
  {
    _id: 'bk-3',
    bookingNumber: 'LS-2026-0150',
    guestName: 'Amara Al-Mansoor',
    property: 'Palazzo Aurelia · Milan',
    suite: 'Royal Courtyard Suite · 305',
    checkIn: '30 Nov 2026',
    nights: 5,
    total: '$6,250.00',
    status: 'pending',
  },
  {
    _id: 'bk-4',
    bookingNumber: 'LS-2026-0144',
    guestName: 'Henrik Lindqvist',
    property: 'The Grand Meridian · Geneva',
    suite: 'Classic Garden Room · 112',
    checkIn: '20 Nov 2026',
    nights: 2,
    total: '$980.00',
    status: 'checkedOut',
  },
  {
    _id: 'bk-5',
    bookingNumber: 'LS-2026-0141',
    guestName: 'Claire Beaumont',
    property: 'Maison Lumière · Paris',
    suite: 'Junior Loft Suite · 302',
    checkIn: '18 Nov 2026',
    nights: 2,
    total: '$1,420.00',
    status: 'cancelled',
  },
];

const SUITE_OPTIONS = [
  { value: 'classic', label: 'Classic Garden Room — $490 / night' },
  { value: 'deluxe', label: 'Deluxe Terrace King — $780 / night' },
  { value: 'royal', label: 'Royal Courtyard Suite — $1,250 / night' },
  { value: 'presidential', label: 'Presidential Lake Suite — $1,950 / night' },
];

const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'All Reservation Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'checkedIn', label: 'Checked In' },
  { value: 'checkedOut', label: 'Checked Out' },
  { value: 'cancelled', label: 'Cancelled' },
];

const SECTION_LINKS = [
  { id: 'tokens', label: 'Color Tokens' },
  { id: 'typography', label: 'Typography & Modes' },
  { id: 'buttons', label: 'Buttons' },
  { id: 'forms', label: 'Form Controls' },
  { id: 'badges', label: 'Badges' },
  { id: 'cards', label: 'Cards & Headers' },
  { id: 'table', label: 'Table & Pagination' },
  { id: 'overlays', label: 'Modals & Dropdowns' },
  { id: 'states', label: 'Feedback States' },
];

/**
 * DesignSystemPreviewPage – Development-only showcase for verifying LuxuryStay design tokens and UI primitives.
 */
const DesignSystemPreviewPage = () => {
  // Interactive UI controls state
  const [loadingDemo, setLoadingDemo] = useState(false);
  const [guestEmail, setGuestEmail] = useState('eleanor.vance@meridian.ch');
  const [selectedSuite, setSelectedSuite] = useState('deluxe');
  const [specialNotes, setSpecialNotes] = useState('Hypoallergenic feather-free pillows requested; late airport transfer at 21:30.');

  // Table & filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortKey, setSortKey] = useState('bookingNumber');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [tableViewMode, setTableViewMode] = useState('data'); // 'data' | 'loading' | 'empty' | 'error'

  // Overlay states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmBusy, setConfirmBusy] = useState(false);

  const filteredBookings = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const list = SAMPLE_BOOKINGS.filter((item) => {
      const matchesQuery =
        !query ||
        item.bookingNumber.toLowerCase().includes(query) ||
        item.guestName.toLowerCase().includes(query) ||
        item.property.toLowerCase().includes(query) ||
        item.suite.toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchesQuery && matchesStatus;
    });

    return [...list].sort((a, b) => {
      const valA = String(a[sortKey] ?? '');
      const valB = String(b[sortKey] ?? '');
      return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
  }, [searchQuery, statusFilter, sortKey, sortDirection]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const handleTriggerConfirm = () => {
    setConfirmBusy(true);
    setTimeout(() => {
      setConfirmBusy(false);
      setIsConfirmOpen(false);
      toast.success('Reservation cancellation confirmed.');
    }, 800);
  };

  const tableColumns = [
    {
      key: 'bookingNumber',
      label: 'Reference',
      sortable: true,
      render: (val) => <span className="fw-semibold text-navy">{val}</span>,
    },
    {
      key: 'guestName',
      label: 'Guest',
      sortable: true,
      render: (val, row) => (
        <div>
          <div className="fw-medium text-navy">{val}</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{row.property}</div>
        </div>
      ),
    },
    {
      key: 'suite',
      label: 'Suite & Room',
    },
    {
      key: 'checkIn',
      label: 'Arrival',
      sortable: true,
    },
    {
      key: 'nights',
      label: 'Nights',
      align: 'center',
    },
    {
      key: 'total',
      label: 'Total',
      align: 'right',
      render: (val) => <span className="fw-semibold text-navy tabular-nums">{val}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <Badge status={val} dot />,
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (_, row) => (
        <Dropdown
          align="right"
          trigger={
            <button
              type="button"
              className="ls-btn ls-btn--ghost ls-btn--sm"
              aria-label={`Actions for ${row.bookingNumber}`}
            >
              <FiMoreVertical />
            </button>
          }
          items={[
            {
              label: 'View Folio',
              icon: <FiEye size={14} />,
              onClick: () => toast(`Viewing ${row.bookingNumber}`),
            },
            {
              label: 'Modify Stay',
              icon: <FiEdit2 size={14} />,
              onClick: () => toast(`Editing ${row.guestName}`),
            },
            {
              label: 'Print Confirmation',
              icon: <FiPrinter size={14} />,
              onClick: () => toast.success(`Prepared print view for ${row.bookingNumber}`),
            },
            { divider: true },
            {
              label: 'Cancel Reservation',
              icon: <FiTrash2 size={14} />,
              danger: true,
              onClick: () => setIsConfirmOpen(true),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-canvas)' }}>
      {/* Executive Top Bar */}
      <header
        style={{
          backgroundColor: 'var(--color-navy)',
          borderBottom: '2px solid var(--color-gold)',
          color: 'var(--text-inverse)',
        }}
      >
        <div className="container py-3 d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div
              style={{
                width: 36,
                height: 36,
                border: '1px solid var(--color-gold)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-gold)',
              }}
              aria-hidden="true"
            >
              <FiLayers size={18} />
            </div>
            <div>
              <div className="font-display fw-semibold" style={{ fontSize: 'var(--text-lg)', lineHeight: 1.2 }}>
                LuxuryStay Hospitality
              </div>
              <div
                style={{
                  fontSize: '0.6875rem',
                  color: 'var(--color-gold)',
                  letterSpacing: 'var(--tracking-widest)',
                  textTransform: 'uppercase',
                }}
              >
                Design System & Component Foundation · Dev Preview
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <Badge variant="gold" label="Development Only" dot />
            <Button variant="secondary" size="sm" leftIcon={<FiEye />} onClick={() => setIsModalOpen(true)}>
              Preview Modal
            </Button>
          </div>
        </div>
      </header>

      {/* Sticky Section Navigation */}
      <nav
        aria-label="Design system sections"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
          position: 'sticky',
          top: 0,
          zIndex: 'var(--z-sticky)',
        }}
      >
        <div className="container py-2 d-flex flex-wrap gap-2">
          {SECTION_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="ls-btn ls-btn--ghost ls-btn--sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>

      <main className="container py-5 d-flex flex-column gap-5">
        {/* Page Header Specimen */}
        <PageHeader
          eyebrow="Task 03A.1 · Design System"
          title="LuxuryStay Design System"
          subtitle="Centralized tokens, Luxury Editorial typography, Navy Executive controls, and accessible hospitality primitives."
          breadcrumb={[
            { label: 'Workspace', to: '/', icon: <FiHome size={13} /> },
            { label: 'Design System' },
          ]}
          actions={
            <>
              <Button
                variant="outline"
                size="md"
                leftIcon={<FiDownload />}
                onClick={() => toast.success('Design tokens verified.')}
              >
                Export Spec
              </Button>
              <Button variant="primary" size="md" leftIcon={<FiPlus />} onClick={() => setIsModalOpen(true)}>
                New Reservation Modal
              </Button>
            </>
          }
        />

        {/* ── 1. COLOR TOKENS ────────────────────────────────────────────────── */}
        <section id="tokens">
          <div className="mb-3">
            <span className="ls-eyebrow">01 · Color Architecture</span>
            <h2 className="mt-1">Brand & Semantic Palette</h2>
          </div>

          <div className="row g-3 mb-4">
            {BRAND_SWATCHES.map((swatch) => (
              <div key={swatch.token} className="col-12 col-sm-6 col-lg">
                <div className="ls-card h-100">
                  <div
                    style={{
                      height: 84,
                      backgroundColor: swatch.hex,
                      color: swatch.text,
                      padding: 'var(--space-3)',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid var(--border-subtle)',
                    }}
                  >
                    <span className="fw-semibold" style={{ fontSize: 'var(--text-xs)' }}>
                      {swatch.hex}
                    </span>
                  </div>
                  <div className="p-3">
                    <div className="fw-semibold text-navy" style={{ fontSize: 'var(--text-sm)' }}>
                      {swatch.name}
                    </div>
                    <code style={{ fontSize: 'var(--text-xs)', color: 'var(--text-accent)' }}>{swatch.token}</code>
                    <p className="mt-2 mb-0" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                      {swatch.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Card title="Semantic & Surface Tokens" subtitle="Restrained operational state tokens calibrated for readable contrast.">
            <div className="row g-3">
              {SEMANTIC_SWATCHES.map((item) => (
                <div key={item.token} className="col-6 col-md-4 col-lg">
                  <div
                    className="p-3 h-100"
                    style={{
                      backgroundColor: item.bg,
                      border: `1px solid ${item.hex}33`,
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: 'var(--radius-xs)',
                          backgroundColor: item.hex,
                          display: 'inline-block',
                        }}
                      />
                      <span className="fw-semibold" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-navy)' }}>
                        {item.name}
                      </span>
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{item.hex}</div>
                    <code style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.token}</code>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* ── 2. TYPOGRAPHY & DUAL VISUAL DIRECTION ──────────────────────────── */}
        <section id="typography">
          <div className="mb-3">
            <span className="ls-eyebrow">02 · Typography & Visual Direction</span>
            <h2 className="mt-1">Luxury Editorial & Navy Executive</h2>
          </div>

          <div className="row g-4">
            <div className="col-12 col-lg-7">
              <Card
                eyebrow="Public Website · Luxury Editorial"
                title="Playfair Display & Inter Hierarchy"
                variant="ivory"
              >
                <div className="d-flex flex-column gap-3">
                  <div>
                    <span className="ls-eyebrow">Geneva · Lakefront Sanctuary</span>
                    <hr className="ls-editorial-rule" />
                    <h1 style={{ fontSize: 'var(--text-4xl)' }}>Timeless Alpine Hospitality</h1>
                    <p className="mt-2 mb-0" style={{ color: 'var(--text-secondary)', maxWidth: '58ch' }}>
                      H1 Display (Playfair Display, 36px) paired with Inter body prose (15px, 1.55 line-height)
                      over warm ivory paper for quiet editorial elegance.
                    </p>
                  </div>

                  <div className="pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    <h2>H2 Section Heading — Signature Suites</h2>
                    <h3 className="mt-2">H3 Card Title — Presidential Lake Suite</h3>
                    <h4 className="mt-2">H4 Sub-heading — Complimentary Concierge</h4>
                    <h5 className="mt-2">H5 Interface Label — Reservation Summary (Inter 600)</h5>
                  </div>

                  <div className="pt-3 d-flex flex-wrap gap-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    <div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Tabular Figures</div>
                      <div className="font-display fw-semibold text-navy tabular-nums" style={{ fontSize: 'var(--text-2xl)' }}>
                        $14,850.00
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Muted Metadata</div>
                      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                        Check-in 14:00 · Check-out 11:00
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="col-12 col-lg-5">
              <Card
                eyebrow="Admin Dashboard · Navy Executive"
                title="Navigation Shell Preview"
                variant="navy"
                className="h-100"
              >
                <p style={{ color: 'var(--text-inverse-muted)', fontSize: 'var(--text-sm)' }}>
                  Operational portals anchor around a deep navy navigation rail with restrained burnished gold active cues.
                </p>

                <div
                  className="mt-3"
                  style={{
                    border: '1px solid var(--border-sidebar)',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                  }}
                >
                  <div className="sidebar-section-label">Front Desk Operations</div>
                  <div className="sidebar-nav-link active">
                    <FiCalendar /> <span>Reservations</span>
                  </div>
                  <div className="sidebar-nav-link">
                    <FiKey /> <span>Room Inventory</span>
                  </div>
                  <div className="sidebar-nav-link">
                    <FiUsers /> <span>Guest Directory</span>
                  </div>
                  <div className="sidebar-nav-link">
                    <FiSliders /> <span>Property Settings</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* ── 3. BUTTONS ─────────────────────────────────────────────────────── */}
        <section id="buttons">
          <div className="mb-3">
            <span className="ls-eyebrow">03 · Actions</span>
            <h2 className="mt-1">Buttons & Interactive States</h2>
          </div>

          <Card
            title="Button Variants & Sizing"
            subtitle="Consistent 4px architectural radius, hairline contrast borders, and accessible focus rings."
            actions={
              <Button
                variant="outline-gold"
                size="sm"
                onClick={() => setLoadingDemo((prev) => !prev)}
              >
                {loadingDemo ? 'Stop Loading Demo' : 'Simulate Loading'}
              </Button>
            }
          >
            <div className="d-flex flex-column gap-4">
              <div>
                <div className="ls-field__label mb-2">Variants</div>
                <div className="d-flex flex-wrap align-items-center gap-2">
                  <Button variant="primary" loading={loadingDemo} leftIcon={<FiPlus />}>
                    Primary Navy
                  </Button>
                  <Button variant="secondary" loading={loadingDemo} leftIcon={<FiCheck />}>
                    Secondary Gold
                  </Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="outline-gold">Outline Gold</Button>
                  <Button variant="ghost">Ghost Action</Button>
                  <Button variant="danger" leftIcon={<FiTrash2 />}>
                    Danger
                  </Button>
                  <Button variant="primary" disabled>
                    Disabled
                  </Button>
                </div>
              </div>

              <div className="pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <div className="ls-field__label mb-2">Sizes (sm · md · lg)</div>
                <div className="d-flex flex-wrap align-items-center gap-3">
                  <Button variant="primary" size="sm">Small Action</Button>
                  <Button variant="primary" size="md">Medium Default</Button>
                  <Button variant="secondary" size="lg" rightIcon={<FiCalendar />}>
                    Reserve Suite
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* ── 4. FORM CONTROLS ───────────────────────────────────────────────── */}
        <section id="forms">
          <div className="mb-3">
            <span className="ls-eyebrow">04 · Data Entry</span>
            <h2 className="mt-1">Inputs, Selects, Textareas & Search</h2>
          </div>

          <Card
            title="Form Primitives & Validation States"
            subtitle="Paired labels via htmlFor, aria-invalid semantics, and warm gold focus rings."
          >
            <div className="row g-4">
              <div className="col-12 col-md-6">
                <Input
                  label="Guest Email Address"
                  type="email"
                  required
                  leftIcon={<FiMail />}
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  hint="Confirmation folio and check-in pass will be sent here."
                />
              </div>

              <div className="col-12 col-md-6">
                <Input
                  label="Staff Passcode"
                  type="password"
                  defaultValue="Meridian2026"
                  leftIcon={<FiUser />}
                  hint="Includes accessible show/hide toggle button."
                />
              </div>

              <div className="col-12 col-md-6">
                <Input
                  label="Passport / ID Number (Error State)"
                  defaultValue="AB-12"
                  error="Passport number must contain at least 6 alphanumeric characters."
                />
              </div>

              <div className="col-12 col-md-6">
                <Input
                  label="Assigned Property Branch (Read-only)"
                  value="The Grand Meridian · Geneva"
                  readOnly
                />
              </div>

              <div className="col-12 col-md-6">
                <Select
                  label="Suite Category"
                  required
                  value={selectedSuite}
                  onChange={(e) => setSelectedSuite(e.target.value)}
                  options={SUITE_OPTIONS}
                  hint="Rates exclude municipal hospitality tax."
                />
              </div>

              <div className="col-12 col-md-6">
                <Select
                  label="Check-in Floor Preference (Error State)"
                  defaultValue=""
                  options={[{ value: 'high', label: 'Upper Quiet Floor' }]}
                  error="Please select a floor preference before confirming."
                />
              </div>

              <div className="col-12">
                <Textarea
                  label="Concierge & Housekeeping Notes"
                  rows={3}
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  maxLength={240}
                  showCount
                  hint="Visible to front-desk reception and assigned housekeeping staff."
                />
              </div>

              <div className="col-12 col-md-6">
                <SearchInput
                  label="Search Reservations"
                  placeholder="Search by booking ID, guest name, or suite…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClear={() => setSearchQuery('')}
                />
              </div>

              <div className="col-12 col-md-6">
                <SearchInput
                  label="Disabled Search Input"
                  value="Locked archive filter"
                  disabled
                />
              </div>
            </div>
          </Card>
        </section>

        {/* ── 5. BADGES ──────────────────────────────────────────────────────── */}
        <section id="badges">
          <div className="mb-3">
            <span className="ls-eyebrow">05 · Status Language</span>
            <h2 className="mt-1">Hospitality & Semantic Badges</h2>
          </div>

          <Card title="Status Mapping & Semantic Variants">
            <div className="d-flex flex-column gap-4">
              <div>
                <div className="ls-field__label mb-2">Reservation Lifecycle (Auto-mapped via status prop)</div>
                <div className="d-flex flex-wrap gap-2">
                  <Badge status="pending" dot />
                  <Badge status="confirmed" dot />
                  <Badge status="checkedIn" dot />
                  <Badge status="checkedOut" dot />
                  <Badge status="cancelled" dot />
                  <Badge status="noShow" dot />
                </div>
              </div>

              <div>
                <div className="ls-field__label mb-2">Room & Housekeeping States</div>
                <div className="d-flex flex-wrap gap-2">
                  <Badge status="available" dot />
                  <Badge status="occupied" dot />
                  <Badge status="reserved" dot />
                  <Badge status="maintenance" dot />
                  <Badge status="outOfOrder" dot />
                  <Badge status="clean" />
                  <Badge status="dirty" />
                  <Badge status="inspecting" />
                </div>
              </div>

              <div>
                <div className="ls-field__label mb-2">Brand & Semantic Variants</div>
                <div className="d-flex flex-wrap gap-2">
                  <Badge variant="navy" label="Executive Tier" />
                  <Badge variant="gold" label="VIP Loyalty" />
                  <Badge variant="neutral" label="Standard" />
                  <Badge variant="success" label="Verified" size="sm" />
                  <Badge variant="warning" label="Action Required" size="sm" />
                  <Badge variant="danger" label="Overdue" size="sm" />
                  <Badge variant="info" label="Syncing" size="sm" />
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* ── 6. CARDS, BREADCRUMB & KPI METRICS ─────────────────────────────── */}
        <section id="cards">
          <div className="mb-3">
            <span className="ls-eyebrow">06 · Containers & Navigation</span>
            <h2 className="mt-1">Cards, StatCards & Breadcrumbs</h2>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-12 col-sm-6 col-lg-3">
              <StatCard label="Occupancy Rate" value="88.4%" trend="+4.2% vs last month" icon={<FiKey />} />
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <StatCard label="Daily Revenue" value="$42,680" trend="+11.8% ADR growth" icon={<FiCalendar />} />
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <StatCard variant="light" label="Arrivals Today" value="24" trend="18 checked in" icon={<FiUsers />} />
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <StatCard variant="light" label="Open Maintenance" value="3" trend="1 priority ticket" trendPositive={false} icon={<FiSliders />} />
            </div>
          </div>

          <div className="row g-4">
            <div className="col-12 col-lg-6">
              <Card
                eyebrow="Breadcrumb Component"
                title="Standard White Surface Card"
                subtitle="Subtle hairline border with structured header and footer slots."
                hoverable
                actions={<Button variant="outline" size="sm">Manage</Button>}
                footer={
                  <div className="d-flex justify-content-between align-items-center">
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                      Last updated 5 mins ago
                    </span>
                    <Button variant="ghost" size="sm">View History</Button>
                  </div>
                }
              >
                <Breadcrumb
                  items={[
                    { label: 'Properties', to: '/' },
                    { label: 'The Grand Meridian', to: '/' },
                    { label: 'Suite 401 Folio' },
                  ]}
                />
                <p className="mt-3 mb-0" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                  Cards support <code>default</code>, <code>ivory</code>, <code>navy</code>, and <code>outlined</code>{' '}
                  variants for adapting cleanly between editorial sections and executive panels.
                </p>
              </Card>
            </div>

            <div className="col-12 col-lg-6">
              <Card
                variant="ivory"
                eyebrow="Editorial Surface"
                title="Ivory Paper Card"
                subtitle="Ideal for guest summary panels and quiet reservation callouts."
              >
                <div className="d-flex justify-content-between align-items-center py-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>Room Rate (4 Nights)</span>
                  <span className="fw-semibold text-navy tabular-nums">$4,200.00</span>
                </div>
                <div className="d-flex justify-content-between align-items-center py-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>Hospitality Tax & Levy</span>
                  <span className="fw-semibold text-navy tabular-nums">$600.00</span>
                </div>
                <div className="d-flex justify-content-between align-items-center pt-3">
                  <span className="fw-semibold text-navy">Total Folio Balance</span>
                  <span className="font-display fw-semibold text-navy tabular-nums" style={{ fontSize: 'var(--text-xl)' }}>
                    $4,800.00
                  </span>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* ── 7. TABLE & PAGINATION ──────────────────────────────────────────── */}
        <section id="table">
          <div className="mb-3">
            <span className="ls-eyebrow">07 · Tabular Data</span>
            <h2 className="mt-1">Table, Sorting, Filters & Pagination</h2>
          </div>

          <Card
            title="Live Reservations Table Preview"
            subtitle="Try searching, sorting columns, or switching states below."
            actions={
              <div className="d-flex flex-wrap gap-2">
                {['data', 'loading', 'empty', 'error'].map((mode) => (
                  <Button
                    key={mode}
                    size="sm"
                    variant={tableViewMode === mode ? 'primary' : 'outline'}
                    onClick={() => setTableViewMode(mode)}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </Button>
                ))}
              </div>
            }
          >
            <div className="row g-3 mb-4">
              <div className="col-12 col-md-7">
                <SearchInput
                  placeholder="Filter sample bookings by guest, reference, or suite…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClear={() => setSearchQuery('')}
                />
              </div>
              <div className="col-12 col-md-5">
                <Select
                  placeholder=""
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={STATUS_FILTER_OPTIONS}
                />
              </div>
            </div>

            <Table
              columns={tableColumns}
              data={tableViewMode === 'empty' ? [] : filteredBookings}
              loading={tableViewMode === 'loading'}
              error={tableViewMode === 'error' ? 'Failed to synchronize property reservations.' : null}
              onRetry={() => setTableViewMode('data')}
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={handleSort}
              emptyTitle="No matching reservations"
              emptyMessage="Adjust your search query or reservation status filter."
              emptyAction={{
                label: 'Reset Filters',
                onClick: () => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setTableViewMode('data');
                },
              }}
              caption="Sample reservations table"
            />

            {tableViewMode === 'data' && (
              <Pagination
                page={currentPage}
                totalPages={6}
                totalCount={114}
                limit={20}
                onPageChange={(nextPage) => setCurrentPage(nextPage)}
              />
            )}
          </Card>
        </section>

        {/* ── 8. MODALS, CONFIRM DIALOG & DROPDOWNS ──────────────────────────── */}
        <section id="overlays">
          <div className="mb-3">
            <span className="ls-eyebrow">08 · Overlays & Menus</span>
            <h2 className="mt-1">Modals, Confirm Dialogs & Dropdowns</h2>
          </div>

          <Card title="Interactive Overlay Triggers">
            <div className="d-flex flex-wrap align-items-center gap-3">
              <Button variant="primary" leftIcon={<FiPlus />} onClick={() => setIsModalOpen(true)}>
                Open Form Modal
              </Button>
              <Button variant="danger" leftIcon={<FiTrash2 />} onClick={() => setIsConfirmOpen(true)}>
                Open Confirm Dialog
              </Button>
              <Dropdown
                label="Quick Actions"
                align="left"
                items={[
                  { label: 'Export Guest Manifest', icon: <FiDownload size={14} />, onClick: () => toast.success('Manifest exported.') },
                  { label: 'Print Daily Arrivals', icon: <FiPrinter size={14} />, onClick: () => toast('Sent to front-desk printer.') },
                  { divider: true },
                  { label: 'Archive Records', icon: <FiTrash2 size={14} />, danger: true, onClick: () => setIsConfirmOpen(true) },
                ]}
              />
            </div>
          </Card>
        </section>

        {/* ── 9. LOADING, EMPTY & ERROR STATES ───────────────────────────────── */}
        <section id="states" className="pb-4">
          <div className="mb-3">
            <span className="ls-eyebrow">09 · System Feedback</span>
            <h2 className="mt-1">Loading, Empty & Error States</h2>
          </div>

          <div className="row g-4">
            <div className="col-12 col-lg-4">
              <Card title="Loading Spinners" className="h-100">
                <div className="d-flex flex-wrap align-items-center justify-content-around py-4 gap-4">
                  <LoadingSpinner size="xs" variant="navy" inline />
                  <LoadingSpinner size="sm" variant="gold" inline />
                  <LoadingSpinner size="md" variant="gold" inline />
                  <LoadingSpinner size="lg" variant="navy" inline />
                </div>
                <LoadingSpinner size="md" variant="gold" showLabel label="Loading suite availability…" />
              </Card>
            </div>

            <div className="col-12 col-lg-4">
              <EmptyState
                className="h-100"
                title="No Housekeeping Tasks"
                description="All assigned suites have been inspected and cleared for upcoming guest arrivals."
                action={{
                  label: 'Assign New Task',
                  variant: 'outline-gold',
                  icon: <FiPlus />,
                  onClick: () => toast('Task drawer preview triggered.'),
                }}
              />
            </div>

            <div className="col-12 col-lg-4">
              <ErrorState
                className="h-100"
                title="Connection Interrupted"
                message="We could not retrieve live folio charges for this property. Please try again."
                onRetry={() => toast.success('Retry callback invoked.')}
              />
            </div>
          </div>
        </section>
      </main>

      {/* Modal Preview */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Suite Reservation"
        subtitle="Preview modal demonstrating consistent form spacing and portal rendering."
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                toast.success('Sample reservation modal submitted.');
              }}
            >
              Confirm Reservation
            </Button>
          </>
        }
      >
        <div className="d-flex flex-column gap-3">
          <Input label="Primary Guest Name" placeholder="e.g. Eleanor Vance" required />
          <Select label="Preferred Suite" options={SUITE_OPTIONS} defaultValue="deluxe" required />
          <Textarea label="Arrival Remarks" rows={3} placeholder="Flight arrival time or dietary preferences…" />
        </div>
      </Modal>

      {/* Confirm Dialog Preview */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleTriggerConfirm}
        loading={confirmBusy}
        variant="danger"
        title="Cancel Reservation LS-2026-0148?"
        message="This action will release Presidential Lake Suite 401 back to inventory and log a cancellation record in the audit trail."
        confirmLabel="Yes, Cancel Reservation"
        cancelLabel="Keep Booking"
      />
    </div>
  );
};

export default DesignSystemPreviewPage;

