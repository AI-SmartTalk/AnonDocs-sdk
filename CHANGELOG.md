# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - 2025-11-04

### Added

#### ✨ New `replacements` Field
- All anonymization responses now include a `replacements` array
- Provides precision mapping of original PII → anonymized text
- Example: `[{ original: "John Doe", anonymized: "[NAME]" }]`
- Available in all endpoints (text and document, sync and streaming)

#### 📄 DOCX Formatting Preservation
- DOCX files now preserve all formatting (bold, italic, colors, alignment, etc.)
- New optional fields in response for DOCX files:
  - `downloadUrl` - Direct download link for anonymized DOCX
  - `filename` - Generated filename for the document
  - `originalFilename` - Original uploaded filename
- Returns formatted DOCX instead of plain text

#### 🔧 Enhanced Type Definitions
- Added `PIIReplacement` interface
- Updated `AnonymizationResult` with new fields
- All new fields are optional for backward compatibility

### Changed
- Improved documentation with DOCX examples
- Updated supported file types section with feature matrix
- Enhanced examples showing new features

### Backward Compatibility
- ✅ **No breaking changes**
- All existing fields remain unchanged
- New fields can be safely ignored by existing clients
- `replacements` array is always present but can be ignored

---

## [1.1.0] - 2025-11-04

### Fixed
- Added `publishConfig` for public NPM scoped package
- Updated package homepage to official website
- Fixed all import paths to use scoped package name

### Changed
- Updated README with correct package name and links
- Added comprehensive links section

---

## [1.0.2] - 2025-11-04

### Changed
- Made SDK universal (browser + Node.js) with zero dependencies
- Removed `form-data` dependency
- Uses native `FormData`, `Blob`, and `fetch` APIs
- Updated minimum Node.js version to 18.0.0

### Added
- Support for `Blob` type in addition to `File` and `Buffer`
- Universal file handling across all environments

---

## [1.0.1] - 2025-11-04

### Added
- Initial scoped package release
- Core client implementation
- Full TypeScript support
- Streaming support with SSE
- Error handling with custom error classes
- Complete documentation

### Features
- Text anonymization
- Document anonymization (PDF, DOCX, TXT)
- Streaming with progress callbacks
- Multiple LLM provider support
- Browser and Node.js compatibility

