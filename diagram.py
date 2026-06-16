import os
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch
import numpy as np

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))

# ═══════════════════════════════════════════════════════════════════════════════
# HELPER FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════════

def rect(ax, x, y, w, h, label,
         fontsize=10,
         fc='white',
         ec='black',
         lw=1.5,
         bold=True):

    r = FancyBboxPatch(
        (x - w/2, y - h/2),
        w,
        h,
        boxstyle="square,pad=0",
        fc=fc,
        ec=ec,
        lw=lw,
        zorder=3
    )

    ax.add_patch(r)

    ax.text(
        x,
        y,
        label,
        ha='center',
        va='center',
        fontsize=fontsize,
        fontweight='bold' if bold else 'normal',
        zorder=4
    )


def oval(ax, x, y, rw, rh, label, fontsize=8):

    e = mpatches.Ellipse(
        (x, y),
        rw * 2,
        rh * 2,
        fc='white',
        ec='black',
        lw=1.2,
        zorder=3
    )

    ax.add_patch(e)

    ax.text(
        x,
        y,
        label,
        ha='center',
        va='center',
        fontsize=fontsize,
        zorder=4
    )


def diamond(ax, x, y, w, h, label, fontsize=9):

    pts = np.array([
        [x, y + h],
        [x + w, y],
        [x, y - h],
        [x - w, y]
    ])

    d = plt.Polygon(
        pts,
        fc='white',
        ec='black',
        lw=1.5,
        zorder=3
    )

    ax.add_patch(d)

    ax.text(
        x,
        y,
        label,
        ha='center',
        va='center',
        fontsize=fontsize,
        fontweight='bold',
        zorder=4
    )


def line(ax, x1, y1, x2, y2, lw=1.3):

    ax.plot(
        [x1, x2],
        [y1, y2],
        'k-',
        lw=lw,
        zorder=2
    )


def card(ax, x, y, label):

    ax.text(
        x,
        y,
        label,
        ha='center',
        va='center',
        fontsize=8,
        fontweight='bold',
        zorder=5
    )

# ═══════════════════════════════════════════════════════════════════════════════
# ER DIAGRAM - CLEAN PROFESSIONAL VERSION
# ═══════════════════════════════════════════════════════════════════════════════

fig, ax = plt.subplots(figsize=(16, 10))

ax.set_xlim(0, 16)
ax.set_ylim(0, 12)

ax.axis('off')
ax.set_aspect('equal')

# ──────────────────────────────────────────────────────────────────────────────
# ENTITY POSITIONS
# ──────────────────────────────────────────────────────────────────────────────

USER_X, USER_Y = 2.5, 9
SCAN_X, SCAN_Y = 8, 9
REPORT_X, REPORT_Y = 13.5, 9

BOOKMARK_X, BOOKMARK_Y = 5.5, 3
NUTRI_X, NUTRI_Y = 11, 3

# ──────────────────────────────────────────────────────────────────────────────
# ENTITIES
# ──────────────────────────────────────────────────────────────────────────────

rect(ax, USER_X, USER_Y, 2.2, 0.8, 'USER')

rect(ax, SCAN_X, SCAN_Y, 2.2, 0.8, 'SCAN')

rect(ax, REPORT_X, REPORT_Y, 2.2, 0.8, 'REPORT')

rect(ax, BOOKMARK_X, BOOKMARK_Y, 2.5, 0.8, 'BOOKMARK')

rect(ax, NUTRI_X, NUTRI_Y, 3.0, 0.8, 'NUTRITION\nDATA', fontsize=9)

# ──────────────────────────────────────────────────────────────────────────────
# RELATIONSHIPS
# ──────────────────────────────────────────────────────────────────────────────

diamond(ax, 5.2, 9, 1.0, 0.5, 'CREATES')

diamond(ax, 10.7, 9, 1.0, 0.5, 'FILES')

diamond(ax, 4.2, 5.8, 1.0, 0.5, 'SAVES')

diamond(ax, 9.5, 5.8, 1.0, 0.5, 'HAS')

# ──────────────────────────────────────────────────────────────────────────────
# CONNECTIONS
# ──────────────────────────────────────────────────────────────────────────────

# USER → CREATES → SCAN

line(ax, 3.6, 9, 4.2, 9)
line(ax, 6.2, 9, 6.9, 9)

# SCAN → FILES → REPORT

line(ax, 9.1, 9, 9.7, 9)
line(ax, 11.7, 9, 12.4, 9)

# USER ↓ SAVES

line(ax, USER_X, 8.6, USER_X, 5.8)
line(ax, USER_X, 5.8, 3.2, 5.8)

# SAVES ↓ BOOKMARK

line(ax, 5.2, 5.8, 5.5, 5.8)
line(ax, 5.5, 5.8, 5.5, 3.4)

# SCAN ↓ HAS

line(ax, SCAN_X, 8.6, SCAN_X, 5.8)
line(ax, SCAN_X, 5.8, 8.5, 5.8)

# HAS ↓ NUTRITION

line(ax, 10.5, 5.8, 11, 5.8)
line(ax, 11, 5.8, 11, 3.4)

# ──────────────────────────────────────────────────────────────────────────────
# CARDINALITIES
# ──────────────────────────────────────────────────────────────────────────────

card(ax, 4.3, 9.35, '1')
card(ax, 6.1, 9.35, 'M')

card(ax, 9.8, 9.35, '1')
card(ax, 11.6, 9.35, 'M')

card(ax, 2.2, 6.2, '1')
card(ax, 4.9, 6.2, 'M')

card(ax, 8.8, 6.2, '1')
card(ax, 10.2, 6.2, 'M')

# ──────────────────────────────────────────────────────────────────────────────
# USER ATTRIBUTES
# ──────────────────────────────────────────────────────────────────────────────

oval(ax, 0.8, 10.4, 0.8, 0.3, 'user_id')
line(ax, 1.5, 10.1, 2.1, 9.4)

oval(ax, 2.5, 10.9, 0.7, 0.3, 'name')
line(ax, 2.5, 10.6, 2.5, 9.4)

oval(ax, 4.2, 10.4, 0.8, 0.3, 'email')
line(ax, 3.6, 10.1, 2.9, 9.4)

oval(ax, 2.5, 7.4, 1.1, 0.3, 'health_mode')
line(ax, 2.5, 7.7, 2.5, 8.6)

# ──────────────────────────────────────────────────────────────────────────────
# SCAN ATTRIBUTES
# ──────────────────────────────────────────────────────────────────────────────

oval(ax, 6.3, 10.4, 0.8, 0.3, 'scan_id')
line(ax, 6.9, 10.1, 7.5, 9.4)

oval(ax, 8, 10.9, 0.8, 0.3, 'fssai_no')
line(ax, 8, 10.6, 8, 9.4)

oval(ax, 9.8, 10.4, 0.9, 0.3, 'veg_status')
line(ax, 9.1, 10.1, 8.5, 9.4)

oval(ax, 8, 7.4, 0.8, 0.3, 'scores')
line(ax, 8, 7.7, 8, 8.6)

# ──────────────────────────────────────────────────────────────────────────────
# REPORT ATTRIBUTES
# ──────────────────────────────────────────────────────────────────────────────

oval(ax, 13.5, 10.8, 0.9, 0.3, 'report_id')
line(ax, 13.5, 10.5, 13.5, 9.4)

oval(ax, 15, 9.8, 0.7, 0.3, 'note')
line(ax, 14.4, 9.6, 14.1, 9.3)

# ──────────────────────────────────────────────────────────────────────────────
# BOOKMARK ATTRIBUTES
# ──────────────────────────────────────────────────────────────────────────────

oval(ax, 3.8, 1.6, 1.1, 0.3, 'bookmark_id')
line(ax, 4.5, 1.9, 5.0, 2.6)

oval(ax, 7.2, 1.6, 1.0, 0.3, 'created_at')
line(ax, 6.5, 1.9, 6.0, 2.6)

# ──────────────────────────────────────────────────────────────────────────────
# NUTRITION ATTRIBUTES
# ──────────────────────────────────────────────────────────────────────────────

oval(ax, 9.2, 1.6, 0.7, 0.3, 'fat')
line(ax, 9.8, 1.9, 10.3, 2.6)

oval(ax, 11, 0.9, 0.9, 0.3, 'calories')
line(ax, 11, 1.2, 11, 2.6)

oval(ax, 12.8, 1.6, 0.8, 0.3, 'sugar')
line(ax, 12.2, 1.9, 11.7, 2.6)

# ──────────────────────────────────────────────────────────────────────────────
# TITLE
# ──────────────────────────────────────────────────────────────────────────────

ax.set_title(
    'TrueBite - Entity Relationship (ER) Diagram',
    fontsize=15,
    fontweight='bold',
    pad=20
)

# ──────────────────────────────────────────────────────────────────────────────
# EXPORT
# ──────────────────────────────────────────────────────────────────────────────

plt.tight_layout()

plt.savefig(
    os.path.join(ROOT_DIR, 'er_diagram.png'),
    dpi=300,
    bbox_inches='tight',
    facecolor='white'
)

plt.close()

print("Professional ER Diagram Generated")

# ═══════════════════════════════════════════════════════════════════════════════
# DFD LEVEL 0 - CONTEXT DIAGRAM
# ═══════════════════════════════════════════════════════════════════════════════
fig, ax = plt.subplots(figsize=(12, 5))
ax.set_xlim(0, 12)
ax.set_ylim(0, 5)
ax.axis('off')
ax.set_aspect('equal')

rect(ax, 1.2, 2.5, 1.8, 0.7, 'User\n(Consumer)', fontsize=10)
rect(ax, 10.8, 2.5, 1.8, 0.7, 'External\nAPIs', fontsize=10)

r = FancyBboxPatch((4.2, 1.2), 3.6, 2.6, boxstyle='round,pad=0.1', fc='#EEF2FF', ec='#1F3864', lw=2, zorder=3)
ax.add_patch(r)
ax.text(6, 2.5, 'TrueBite\nFood Safety &\nCompliance Platform', ha='center', va='center', fontsize=11, fontweight='bold', color='#1F3864', zorder=4)

ax.annotate('', xy=(4.2, 3.2), xytext=(2.1, 3.2), arrowprops=dict(arrowstyle='->', lw=1.5, color='black'), zorder=5)
ax.text(3.15, 3.45, 'Product Image /\nBarcode / Login Info', ha='center', fontsize=8)

ax.annotate('', xy=(2.1, 2.0), xytext=(4.2, 2.0), arrowprops=dict(arrowstyle='->', lw=1.5, color='black'), zorder=5)
ax.text(3.15, 1.65, 'Health Grades /\nFSSAI Status / Scan History', ha='center', fontsize=8)

ax.annotate('', xy=(9.9, 3.2), xytext=(7.8, 3.2), arrowprops=dict(arrowstyle='->', lw=1.5, color='black'), zorder=5)
ax.text(8.85, 3.45, 'OCR Request /\nBarcode / FSSAI No.', ha='center', fontsize=8)

ax.annotate('', xy=(7.8, 2.0), xytext=(9.9, 2.0), arrowprops=dict(arrowstyle='->', lw=1.5, color='black'), zorder=5)
ax.text(8.85, 1.65, 'Product Data /\nLicence Status', ha='center', fontsize=8)

ax.set_title('Level 0 DFD - Context Diagram', fontsize=12, fontweight='bold')
plt.tight_layout()
plt.savefig(os.path.join(ROOT_DIR, 'dfd_level0.png'), dpi=300, bbox_inches='tight', facecolor='white')
plt.close()
print('DFD0 Diagram Generated')

# ═══════════════════════════════════════════════════════════════════════════════
# DFD LEVEL 1 - MAIN FUNCTIONAL PROCESSES
# ═══════════════════════════════════════════════════════════════════════════════
fig, ax = plt.subplots(figsize=(14, 9))
ax.set_xlim(0, 14)
ax.set_ylim(0, 9)
ax.axis('off')
ax.set_aspect('equal')

rect(ax, 1, 4.5, 1.6, 0.6, 'User', fontsize=10)

procs = [
    (5, 8, '1.0\nAuthentication'),
    (5, 6.2, '2.0\nProduct Input\nProcessing'),
    (5, 4.4, '3.0\nFSSAI\nVerification'),
    (5, 2.6, '4.0\nHealth Grading\nEngine'),
    (5, 0.8, '5.0\nFood Log &\nReporting'),
]
for px, py, lbl in procs:
    e = mpatches.Ellipse((px, py), 2.6, 0.9, fc='#EEF2FF', ec='#1F3864', lw=1.5, zorder=3)
    ax.add_patch(e)
    ax.text(px, py, lbl, ha='center', va='center', fontsize=8, fontweight='bold', color='#1F3864', zorder=4)


def datastore(ax, x, y, w, h, label):
    ax.plot([x, x + w], [y + h, y + h], 'k-', lw=1.5, zorder=3)
    ax.plot([x, x + w], [y, y], 'k-', lw=1.5, zorder=3)
    ax.text(x + w / 2, y + h / 2, label, ha='center', va='center', fontsize=8, zorder=4)


def arr(ax, x1, y1, x2, y2, lbl='', side='top'):
    ax.annotate('', xy=(x2, y2), xytext=(x1, y1), arrowprops=dict(arrowstyle='->', lw=1.3, color='black'), zorder=5)
    mx, my = (x1 + x2) / 2, (y1 + y2) / 2
    off = 0.15 if side == 'top' else -0.15
    ax.text(mx, my + off, lbl, ha='center', fontsize=7.5, color='#333')


datastore(ax, 9, 7.6, 3.5, 0.5, 'D1  Supabase - Users Table')
datastore(ax, 9, 5.8, 3.5, 0.5, 'D2  Supabase - Scans Table')
datastore(ax, 9, 4.0, 3.5, 0.5, 'D3  FSSAI FOSCOS API')
datastore(ax, 9, 2.2, 3.5, 0.5, 'D4  Open Food Facts API')
datastore(ax, 9, 0.4, 3.5, 0.5, 'D5  Supabase - Reports Table')

arr(ax, 1.8, 8, 3.7, 8, 'Login / Register Info')
arr(ax, 1.8, 6.2, 3.7, 6.2, 'Image / Barcode')
arr(ax, 1.8, 4.4, 3.7, 4.4, 'FSSAI Number')
arr(ax, 3.7, 2.6, 1.8, 2.6, 'Health Grades', 'bottom')
arr(ax, 1.8, 0.8, 3.7, 0.8, 'Save / Report')

arr(ax, 6.3, 8, 9, 7.85, 'User Record')
arr(ax, 6.3, 6.2, 9, 6.05, 'Scan Record')
arr(ax, 6.3, 4.4, 9, 4.25, 'Verify Licence')
arr(ax, 6.3, 2.6, 9, 2.45, 'Fetch Product Data')
arr(ax, 6.3, 0.8, 9, 0.65, 'Report Record')

ax.set_title('Level 1 DFD - Main Functional Processes', fontsize=12, fontweight='bold')
plt.tight_layout()
plt.savefig(os.path.join(ROOT_DIR, 'dfd_level1.png'), dpi=300, bbox_inches='tight', facecolor='white')
plt.close()
print('DFD1 Diagram Generated')

# ═══════════════════════════════════════════════════════════════════════════════
# DFD LEVEL 2 - SCAN INPUT & GRADING
# ═══════════════════════════════════════════════════════════════════════════════
fig, ax = plt.subplots(figsize=(13, 7))
ax.set_xlim(0, 13)
ax.set_ylim(0, 7)
ax.axis('off')
ax.set_aspect('equal')

rect(ax, 1.2, 3.5, 1.6, 0.6, 'User', fontsize=10)

procs2 = [
    (4.5, 6, '2.1\nImage Upload\n(Multer)'),
    (4.5, 4.2, '2.2\nBarcode\nDecoding\n(html5-qrcode)'),
    (4.5, 2.4, '2.3\nOCR Text\nExtraction\n(Google Vision)'),
    (8.5, 5.1, '2.4\nNutrition Data\nParsing'),
    (8.5, 2.4, '2.5\nGrading Engine\n(4 Algorithms)'),
]
for px, py, lbl in procs2:
    e = mpatches.Ellipse((px, py), 2.8, 1.1, fc='#FFF7ED', ec='#9A3412', lw=1.5, zorder=3)
    ax.add_patch(e)
    ax.text(px, py, lbl, ha='center', va='center', fontsize=7.5, fontweight='bold', color='#9A3412', zorder=4)


datastore(ax, 10.5, 4.7, 2.0, 0.4, 'D1 OFacts API')
datastore(ax, 10.5, 2.0, 2.0, 0.4, 'D2 Scans DB')

arr(ax, 1.8, 4.5, 2.1, 6, 'Upload Image')
arr(ax, 1.8, 3.5, 2.1, 4.2, 'Scan Barcode')
arr(ax, 1.8, 2.5, 2.1, 2.4, 'Raw Image')

arr(ax, 5.9, 6, 7.1, 5.4, 'Image Data')
arr(ax, 5.9, 4.2, 7.1, 4.8, 'Barcode No.')
arr(ax, 5.9, 2.4, 7.1, 2.4, 'OCR Text')

arr(ax, 9.9, 5.1, 10.5, 4.9, 'Product Lookup')
arr(ax, 9.9, 2.4, 10.5, 2.2, 'Save Score')

ax.annotate('', xy=(8.5, 3.8), xytext=(8.5, 4.45), arrowprops=dict(arrowstyle='->', lw=1.3, color='black'), zorder=5)
ax.text(8.8, 4.1, 'Nutrition JSON', fontsize=7.5)

ax.set_title('Level 2 DFD - Scan Input & Grading Process', fontsize=12, fontweight='bold')
plt.tight_layout()
plt.savefig(os.path.join(ROOT_DIR, 'dfd_level2.png'), dpi=300, bbox_inches='tight', facecolor='white')
plt.close()
print('DFD2 Diagram Generated')

print('ALL FOUR DIAGRAMS GENERATED')
