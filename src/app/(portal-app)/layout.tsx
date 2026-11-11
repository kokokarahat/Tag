import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tag Markets",
  description: "Your Tag Markets trading account.",
};

/**
 * Root layout for the authenticated portal clone.
 *
 * The legacy portal ships a large, ordered set of stylesheets. They are served
 * straight from `/public` so the browser receives the source bytes unchanged —
 * routing them through the bundler re-serialises numbers and shifts the pixel
 * grid of the fixed header/sidebar.
 */
const LEGACY_STYLES = [
  "/assets/mn/global/plugins/font-awesome/css/font-awesome.min.css",
  "/assets/mn/global/plugins/simple-line-icons/simple-line-icons.min.css",
  "/lib/bootstrap/3.3.6/css/bootstrap.min.css",
  "/assets/mn/global/plugins/uniform/css/uniform.default.css",
  "/assets/mn/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css",
  "/assets/mn/global/css/components.min.css",
  "/assets/mn/global/css/plugins.min.css",
  "/assets/mn/layouts/layout/css/layout.min.css",
  "/assets/mn/layouts/layout/css/themes/darkblue.min.css",
  "/assets/mn/layouts/layout/css/custom.min.css",
  "/lib/font-awesome/5.7.2/css/all.min.css",
  "/css/icon-fix.css",
  "/css/layout-fix.css",
  "/plugins/datatables/1.10.12/DataTables-1.10.12/css/dataTables.bootstrap.min.css",
  "/plugins/datatables/1.10.12/AutoFill-2.1.2/css/autoFill.bootstrap.css",
  "/plugins/datatables/1.10.12/Buttons-1.2.1/css/buttons.bootstrap.min.css",
  "/plugins/datatables/1.10.12/ColReorder-1.3.2/css/colReorder.bootstrap.min.css",
  "/plugins/datatables/1.10.12/FixedColumns-3.2.2/css/fixedColumns.bootstrap.min.css",
  "/plugins/datatables/1.10.12/FixedHeader-3.1.2/css/fixedHeader.bootstrap.min.css",
  "/plugins/datatables/1.10.12/KeyTable-2.1.2/css/keyTable.bootstrap.min.css",
  "/plugins/datatables/1.10.12/Responsive-2.1.0/css/responsive.bootstrap.min.css",
  "/plugins/datatables/1.10.12/RowReorder-1.1.2/css/rowReorder.bootstrap.min.css",
  "/plugins/datatables/1.10.12/Scroller-1.4.2/css/scroller.bootstrap.min.css",
  "/plugins/datatables/1.10.12/Select-1.2.0/css/select.bootstrap.min.css",
  "/plugins/bootstrap-pwstrength/1.2.10/pwstrength-bootstrap.custom.css",
  "/plugins/jquery.bxslider/4.1.2/jquery.bxslider.css",
  "/plugins/bootstrap-select-master/1.12.4/dist/css/bootstrap-select.min.css",
  "/plugins/bootstrap-datetimepicker/4.17.43/build/css/bootstrap-datetimepicker.min.css",
  "/plugins/jquery-confirm/3.3.4/dist/jquery-confirm.min.css",
  "/plugins/summernote/0.8.2/dist/summernote.css",
  "/plugins/metronic.profile/1.0.0/profile.min.css",
  "/plugins/metronic.profile/1.0.0/profile.custom.css",
  "/css/style.css",
  "/css/responsive.css",
  "/css/dwf.css",
  "/css/custom.css",
  "/themes/black_green_tagmarkets/main.css",
  "/plugins/jquery-steps/1.1.0/build/jquery.steps.css",
  "/css/deposit-modal.css",
].map((href) => `/sites/tagmarkets/portal${href}`);

export default function PortalAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {LEGACY_STYLES.map((href) => (
          <link key={href} rel="stylesheet" href={href} />
        ))}
      </head>
      <body className="page-header-fixed page-sidebar-closed-hide-logo page-content-white page-sidebar-fixed zoom75">
        {children}
      </body>
    </html>
  );
}
