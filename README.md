# LAVIE FASHION — website demo tiếng Việt để thực hành GA4

Website bán hàng thời trang nữ dạng tĩnh, xây bằng HTML, CSS và JavaScript thuần. Không cần Node.js, npm hay pnpm để mở/chạy bản demo này.

## Tính năng có sẵn

- Giao diện responsive cho desktop, tablet và điện thoại.
- Danh mục sản phẩm, tìm kiếm, sắp xếp theo giá/tên, xem chi tiết sản phẩm.
- Chọn size và màu; thêm/bớt số lượng; xóa sản phẩm khỏi giỏ.
- Giỏ hàng và danh sách yêu thích được lưu trên trình duyệt bằng `localStorage`. Sau khi thêm sản phẩm, giỏ hàng tự mở để xem số lượng, size, màu và tổng tiền.
- Mã giảm giá demo `LAVIE10` (giảm 10% trên tiền hàng), được giữ khi tải lại trang nếu giỏ còn hàng; tự xóa khi giỏ trống hoặc hoàn tất đơn.
- Phí giao hàng giả lập 25.000₫; miễn phí cho đơn từ 699.000₫.
- Form checkout có kiểm tra thông tin, lựa chọn phương thức thanh toán demo và trang xác nhận đơn demo.
- Nút **Đơn demo** ở đầu trang (desktop và menu di động) và trong xác nhận đơn mở lịch sử tối đa 30 đơn trên trình duyệt hiện tại. Các nút đầu trang dùng thuộc tính `data-demo-orders`. Lịch sử lưu mã đơn, thời gian, tổng tiền, số lượng và dòng sản phẩm; không lưu thông tin cá nhân nhập trong form.
- Đóng hướng dẫn chọn size sẽ quay về chi tiết sản phẩm, giữ size, màu và số lượng đang chọn.
- Tích hợp Google Tag Manager để quản lý thẻ GA4; website đẩy sự kiện thương mại điện tử vào dataLayer.

## Chạy trên máy bằng VS Code

1. Giải nén thư mục `lavie-fashion-ga4`.
2. Mở VS Code → **File → Open Folder...** → chọn thư mục `lavie-fashion-ga4`.
3. Mở file `index.html` rồi mở bằng trình duyệt.
   - Cách dễ nhất: cài extension **Live Server** trong VS Code (Ritwick Dey), mở `index.html`, nhấn **Go Live** ở thanh trạng thái.
   - Nếu chưa muốn cài extension, nhấp đúp vào `index.html` trong File Explorer để mở bằng trình duyệt. Hầu hết tính năng demo vẫn chạy; Live Server được khuyến nghị để có môi trường ổn định hơn.
4. Thử tìm sản phẩm, mở chi tiết, chọn size/màu, thêm vào giỏ, áp dụng mã `LAVIE10`, rồi điền form checkout. Không có giao dịch hoặc đơn hàng thật.

## Kết nối GA4 qua Google Tag Manager

1. Tạo hoặc chọn một GA4 Property, sau đó tạo Web data stream cho website.
2. Trong Google Tag Manager, tạo Google tag với Measurement ID của Web data stream và kích hoạt trên mọi trang.
3. Cài container GTM vào index.html: đoạn script nằm trong head và đoạn noscript nằm ngay sau body.
4. Tạo các GA4 Event tag trong GTM cho những sự kiện được đẩy vào dataLayer; dùng Custom Event trigger có tên trùng với tên sự kiện.
5. Dùng Preview/Tag Assistant để kiểm tra, sau đó xuất bản container. Đối chiếu sự kiện trong GA4 DebugView.

Website mẫu đã cài container GTM-5M5HVX2L. Giữ GA_MEASUREMENT_ID trong config.js để trống khi dùng GTM; nếu điền Measurement ID, app.js sẽ nạp gtag.js trực tiếp và có thể tạo phương thức đo lường thứ hai.

Các đơn hàng trên website chỉ là dữ liệu demo; không có giao dịch hoặc thanh toán thật.

### Event GA4 được gọi trong bản demo

- `page_view` (Google tag tự động gửi khi cấu hình)
- `view_item_list`, `select_item`, `view_item`
- `search`
- `add_to_cart`, `remove_from_cart`, `view_cart`
- `add_to_wishlist`, `remove_from_wishlist`
- `begin_checkout`, `add_shipping_info`, `add_payment_info`, `purchase`
- `add_coupon`, `sign_up`

Các event thương mại điện tử có thông tin `currency`, `value` và `items` phù hợp với hành vi tương ứng. `purchase` chỉ được gửi khi người dùng xác nhận **đơn demo**; không có xử lý thanh toán thật.

Để trống `GA_MEASUREMENT_ID` chỉ tắt việc nạp `gtag.js` trực tiếp. Container GTM `GTM-5M5HVX2L` vẫn được nạp và có thể gửi sự kiện đến GA4 theo cấu hình đã xuất bản. Xem payload trong `window.dataLayer`; dùng GTM Preview/Tag Assistant và GA4 DebugView để xác minh việc gửi thực tế. Thay đổi giao diện và ảnh cục bộ không thay đổi ID, payload hay cấu hình GTM/GA4 hiện có.

## Đưa website lên GitHub và bật GitHub Pages

### A. Tạo repository

1. Đăng nhập [GitHub](https://github.com/).
2. Nhấn **+ → New repository**.
3. Đặt tên, ví dụ `lavie-fashion-ga4`.
4. Chọn **Public** nếu dùng GitHub Free và muốn bật GitHub Pages theo cách đơn giản; không tải thông tin bí mật hoặc dữ liệu cá nhân lên repository.
5. Nhấn **Create repository**.

### B. Đưa code lên bằng giao diện web (dễ nhất)

1. Mở repository vừa tạo.
2. Chọn **Add file → Upload files**.
3. Mở thư mục `lavie-fashion-ga4` trên máy và kéo **các file bên trong** vào vùng tải lên (không kéo cả thư mục bọc bên ngoài): `index.html`, `styles.css`, `app.js`, `config.js`, `README.md` và toàn bộ thư mục `assets/` (bao gồm `assets/images/`).
4. Vì Windows có thể ẩn file bắt đầu bằng dấu chấm, hãy tạo thêm file rỗng `.nojekyll` ngay trên GitHub: **Add file → Create new file**, nhập tên `.nojekyll`, để nội dung trống và commit.
5. Nhấn **Commit changes** để lưu các file đã upload.

> Có thể dùng cách upload trên trình duyệt, không cần Git hoặc Terminal.

### C. Bật website công khai bằng GitHub Pages

1. Trong repository, chọn **Settings → Pages**.
2. Ở **Build and deployment**, chọn **Deploy from a branch**.
3. Chọn branch **main**, folder **/(root)**, rồi nhấn **Save**.
4. Đợi GitHub Pages triển khai xong; địa chỉ thường có dạng `https://TEN-GITHUB.github.io/lavie-fashion-ga4/`. Xem đường dẫn thật ở chính trang **Settings → Pages**.
5. Mở link công khai bằng cửa sổ ẩn danh hoặc điện thoại để thử lại. Khi thay đổi code và commit file mới, GitHub Pages sẽ tự triển khai bản cập nhật.

### D. Cẩn trọng với GA4 khi đăng website

- `config.js` chứa Measurement ID công khai, điều này bình thường với GA4.
- Không đưa mật khẩu, API key, private key hoặc dữ liệu khách hàng thật lên GitHub.
- Website và dữ liệu sản phẩm/đơn hàng là dữ liệu demo; GitHub Pages chỉ host file tĩnh, không phải backend thương mại điện tử.

## Tài liệu chính thức

- [Google tag / GA4](https://developers.google.com/tag-platform/gtagjs)
- [Tạo website GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)

## Giới hạn cần biết

Bản này mô phỏng trải nghiệm cửa hàng cho dự án GA4. Sản phẩm, giá, mã ưu đãi, phí giao hàng và đơn hàng đều là dữ liệu mẫu. Không có cơ sở dữ liệu chung giữa các thành viên, quản lý tồn kho, tài khoản khách hàng, email xác nhận, xử lý giao vận hay cổng thanh toán thực. Nếu muốn vận hành bán hàng thật, cần backend bảo mật, quản trị sản phẩm/đơn hàng và tích hợp thanh toán phù hợp.

## Ảnh sản phẩm cục bộ và nguồn

Tám ảnh minh họa được lưu tại `assets/images/lv001.jpg` đến `lv008.jpg`, chiều rộng 800 px để giảm tải mạng khi mở danh mục. Các ảnh chỉ minh họa loại trang phục; chất liệu, màu tùy chọn và thiết kế mô tả là dữ liệu demo, không phải cam kết về sản phẩm trong ảnh. Khi ảnh lỗi, giao diện dùng `assets/images/product-placeholder.svg` do dự án tự tạo.

| Sản phẩm / tệp | Nguồn chính xác |
| --- | --- |
| LV001 / `lv001.jpg` — đầm đỏ | [Unsplash, ảnh gốc đang dùng trong demo](https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=82) |
| LV002 / `lv002.jpg` — sơ mi trắng có nút | [Woman Buttoning her Shirt — Pexels](https://www.pexels.com/photo/woman-buttoning-her-shirt-7648167/) · [tệp tải](https://images.pexels.com/photos/7648167/pexels-photo-7648167.jpeg?auto=compress&cs=tinysrgb&w=800) |
| LV003 / `lv003.jpg` — quần ống rộng | [Blonde Posing in Wide Leg Pants — Pexels](https://www.pexels.com/photo/blonde-posing-in-wide-leg-pants-16554921/) · [tệp tải](https://images.pexels.com/photos/16554921/pexels-photo-16554921.jpeg?auto=compress&cs=tinysrgb&w=800) |
| LV004 / `lv004.jpg` — áo thun trắng | [Unsplash, ảnh gốc đang dùng trong demo](https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=82) |
| LV005 / `lv005.jpg` — chân váy chữ A | [Unsplash, ảnh gốc đang dùng trong demo](https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=800&q=82) |
| LV006 / `lv006.jpg` — blazer trắng | [A Woman Wearing White Blazer — PNW Production / Pexels](https://www.pexels.com/photo/a-woman-wearing-white-blazer-8250254/) · [tệp tải](https://images.pexels.com/photos/8250254/pexels-photo-8250254.jpeg?auto=compress&cs=tinysrgb&w=800) |
| LV007 / `lv007.jpg` — cardigan hồng nhạt | [Woman with Braided Hair Wearing a Cardigan and Pants — SHVETS production / Pexels](https://www.pexels.com/photo/woman-with-braided-hair-wearing-a-cardigan-and-pants-7506935/) · [tệp tải](https://images.pexels.com/photos/7506935/pexels-photo-7506935.jpeg?auto=compress&cs=tinysrgb&w=800) |
| LV008 / `lv008.jpg` — túi đỏ có quai | [Unsplash, ảnh gốc đang dùng trong demo](https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=82) |

Tham khảo giấy phép tại [Unsplash License](https://unsplash.com/license) và [Pexels License](https://www.pexels.com/license/). Giữ bảng nguồn khi sao chép bản demo. Ảnh được tải về để danh mục hoạt động khi nguồn bên ngoài lỗi; không có yêu cầu tải ảnh sản phẩm từ dịch vụ bên ngoài khi xem danh mục.

## Kiểm tra bản sửa hiện tại

Bản sửa đã qua 12 kiểm thử Node VM và rà soát mã độc lập; kiểm thử tự động không gửi yêu cầu GA thật. Kiểm tra giao diện bằng trình duyệt và Tag Assistant/GA4 DebugView vẫn đang chờ thực hiện. Người dùng đã cho phép commit, push và triển khai ngày 2026-11-03; quá trình phát hành đang tiến hành, chờ xác nhận kết quả. Xem [kế hoạch và trạng thái](plans/261103-lavie-feedback-repairs/plan.md) cùng [checklist thủ công](plans/261103-lavie-feedback-repairs/reports/manual-validation-checklist.md).

Triển khai các file HTML/CSS/JS tĩnh không làm mất dữ liệu GA4 lịch sử trong property hiện tại. Thu thập dữ liệu mới vẫn phụ thuộc vào việc giữ nguyên cấu hình ID/thẻ, trigger đã xuất bản và tránh gắn thẻ trùng lặp.
