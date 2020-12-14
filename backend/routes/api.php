<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
//Common data routes
Route::get('common-data-manager/common-data', 'HelperController@getCommonData');
Route::post('authentication/login', 'UserController@authenticate');
//Users

Route::post('users/register-user', 'UserController@registerUsers');
Route::get('users/list-users', 'UserController@listUsers');
Route::post('users/update-users', 'UserController@updateUsers');
Route::post('users/delete-users', 'UserController@deleteUsers');

//Route::group(['middleware' => ['jwt.verify']], function () {

//blog
Route::post('blog/add-blog-info', 'BlogController@addBlogInfo');
Route::get('blog/list-blog-info/{blogListItemRange}/{userId}', 'BlogController@listBlogInfo');
Route::post('blog/update-blog-info', 'BlogController@updateBlogInfo');
Route::post('blog/delete-blog-info', 'BlogController@deleteBlogInfo');
Route::post('blog/update-blog-status', 'BlogController@updateBlogStatus');

Route::post('blog/add-blog-tag', 'BlogTagController@addBlogTag');
Route::get('blog/get-blog-tag/{blogId}/{lan}', 'BlogTagController@listBlogTag');
Route::post('blog/update-blog-tag', 'BlogTagController@updateBlogTag');
Route::post('blog/delete-blog-tag', 'BlogTagController@deleteBlogTag');

//blog content
Route::post('blog/add-blog-content', 'BlogContentController@addBlogContent');
Route::post('blog/update-blog-content', 'BlogContentController@updateBlogContent');
Route::get('blog/list-blog-content/{blogId}', 'BlogContentController@listBlogContent');
Route::post('blog/delete-blog-content', 'BlogContentController@deleteBlogContent');
Route::get('blog/list-all-blog/{offset}', 'BlogContentController@listAllBlog');

Route::get('blog/blogContentFile/{file_name}', function ($filename) {
    $path = storage_path('app') . '/blogContentFile/' . $filename;
    $image = \File::get($path);
    $mime = \File::mimeType($path);
    return \Response::make($image, 200)->header('Content-Type', $mime);
});

//services
Route::post('service/add-service-info', 'ServiceController@addServiceInfo');
Route::post('service/edit-service-info', 'ServiceController@editServiceInfo');
Route::post('service/delete-service-info', 'ServiceController@deleteServiceInfo');
Route::get('service/list-service-info', 'ServiceController@listServiceInfo');

//service Content
Route::post('service/add-service-content', 'ServiceContentController@addServiceContent');
Route::post('service/update-service-content', 'ServiceContentController@updateServiceContent');
Route::get('service/list-service-content/{serviceId}/{language}', 'ServiceContentController@listServiceContent');
Route::get('website-service/list-service-content/{serviceId}', 'ServiceContentController@listServiceContent');
Route::post('service/delete-service-content', 'ServiceContentController@deleteServiceContent');
Route::get('service/list-all-service', 'ServiceContentController@listAllServices');
Route::get('service/serviceContentFile/{file_name}', function ($filename) {
    $path = storage_path('app') . '/serviceContentFile/' . $filename;
    $file = \File::get($path);
    $mime = \File::mimeType($path);
    return \Response::make($file, 200)->header('Content-Type', $mime);
});
Route::get('website-service/serviceContentFile/{file_name}', function ($filename) {
    $path = storage_path('app') . '/serviceContentFile/' . $filename;
    $file = \File::get($path);
    $mime = \File::mimeType($path);
    return \Response::make($file, 200)->header('Content-Type', $mime);
});

//product
Route::post('products/store-products', 'ProductController@store');
Route::post('products/update-products', 'ProductController@update');
Route::get('products/delete-products/{id}', 'ProductController@delete');
Route::get('products/list-products', 'ProductController@productList');

//product content
Route::post('products/add-product-content', 'ProductContentController@addProductContent');
Route::post('products/update-product-content', 'ProductContentController@updateProductContent');
Route::get('products/list-product-content/{productId}/{lan}', 'ProductContentController@listProductContent');
Route::post('products/delete-product-content', 'ProductContentController@deleteProductContent');
Route::get('products/list-all-product', 'ProductContentController@listAllProducts');
Route::get('products/productFiles/{file_name}', function ($filename) {
    $path = storage_path('app') . '/productFiles/' . $filename;
    $image = \File::get($path);
    $mime = \File::mimeType($path);
    return \Response::make($image, 200)->header('Content-Type', $mime);
});


Route::post('partners/store-partners', 'PartnerController@store');
Route::post('partners/update-partners', 'PartnerController@update');
Route::get('partners/delete-partners/{id}', 'PartnerController@delete');
Route::get('partners/list-partners', 'PartnerController@partnerList');

Route::get('partners/partnerFiles/{file_name}', function ($filename) {
    $path = storage_path('app') . '/partnerFiles/' . $filename;
    $image = \File::get($path);
    $mime = \File::mimeType($path);
    return \Response::make($image, 200)->header('Content-Type', $mime);
});


Route::post('customers/store-customers', 'CustomerController@store');
Route::post('customers/update-customers', 'CustomerController@update');
Route::get('customers/delete-customers/{id}', 'CustomerController@delete');
Route::get('customers/list-customers', 'CustomerController@customerList');

Route::get('customers/customerFiles/{file_name}', function ($filename) {
    $path = storage_path('app') . '/customerFiles/' . $filename;
    $image = \File::get($path);
    $mime = \File::mimeType($path);
    return \Response::make($image, 200)->header('Content-Type', $mime);
});

//projects
Route::post('projects/store-projects', 'ProjectController@store');
Route::post('projects/update-projects', 'ProjectController@update');
Route::get('projects/delete-projects/{id}', 'ProjectController@delete');
Route::get('projects/list-projects', 'ProjectController@projectList');


Route::get('projects/list-project-files/{projectId}', 'ProjectController@listProjectFiles');
Route::get('projects/delete-project-file/{fileId}/{projectFileId}', 'ProjectController@deleteProjectFile');
Route::post('projects/store-project-file', 'ProjectController@storeFile');
Route::get('projects/projectFiles/{file_name}', function ($filename) {
    $path = storage_path('app') . '/projectFiles/' . $filename;
    $image = \File::get($path);
    $mime = \File::mimeType($path);
    return \Response::make($image, 200)->header('Content-Type', $mime);
});


Route::post('aboutus/store-aboutus', 'AboutUsController@store');
Route::post('aboutus/update-aboutus', 'AboutUsController@update');
Route::get('aboutus/delete-aboutus/{id}', 'AboutUsController@delete');
Route::get('aboutus/delete-aboutus-file/{id}', 'AboutUsController@deleteFile');
Route::get('aboutus/list-aboutus-files/{aboutUsId}', 'AboutUsController@listAboutUsFiles');
Route::post('aboutus/store-aboutus-file', 'AboutUsController@storeAboutUsFiles');
Route::get('aboutus/list-aboutus', 'AboutUsController@aboutUsList');

Route::get('aboutus/aboutUsFiles/{file_name}', function ($filename) {
    $path = storage_path('app') . '/aboutUsFiles/' . $filename;
    $image = \File::get($path);
    $mime = \File::mimeType($path);
    return \Response::make($image, 200)->header('Content-Type', $mime);
});

Route::get('contact-us/list-contact-us-info', 'ContactUsController@listContactUsInfo');

///
/// ============================================================================================================================
///Website
///
///
///
//});

//Headers
Route::get('header/list-services', 'ServiceController@listHeaderServices');
Route::get('header/list-projects-service', 'ServiceController@listProjectServices');


//Home
Route::get('home/list-products', 'ProductController@listAllProducts');
Route::get('home/list-customers-review', 'CustomerController@customerList');
Route::get('home/list-latest-blog', 'BlogController@listLatestBlog');


//Services
Route::get('website-service/list-service-base-category/{categoryId}', 'ServiceController@listServicesForWebsite');
Route::get('website-service/all-services', 'ServiceController@listAllServicesForWebsite');

//about us
Route::get('about-us/info', 'AboutUsController@aboutUsInfo');
//blog
Route::get('blog/list-blog/{offset}', 'BlogController@listBlogWithOffset');
Route::post('blog/list-searched-blog', 'BlogController@searchBlog');
Route::get('blog/list-blog-content-tags/{blogId}', 'BlogController@listBlogContentAndTags');
Route::get('blog/list-related-blog/{categoryId}', 'BlogController@listRelatedBlog');
Route::post('blog/store-blog-comment', 'BlogCommentController@storeBlogComments');
Route::get('blog/list-blog-comment/{blogId}', 'BlogCommentController@listBlogComments');

//product
Route::get('products/list-products-info', 'ProductController@listAllProducts');
Route::get('products/list-products-website', 'ProductController@listProductsForWebsite');

//projects
Route::get('projects/list-projects-by-service/{serviceId}/{offset}', 'ProjectController@getProjectsByService');
Route::get('projects/list-projects-by-offset/{offset}', 'ProjectController@listProjectWithOffset');
//contact us
Route::post('contact-us/store-message', 'ContactUsController@storeMessages');
