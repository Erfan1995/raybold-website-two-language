<?php

namespace App\Http\Controllers;

use App\ContactUsModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ContactUsController extends Controller
{
    //
    public function storeMessages(Request $request)
    {
        try {
            $this->validator($request->all())->validate();
            $insertedData = ContactUsModel::create([
                "full_name" => $request->get('name'),
                "email" => $request->get('email'),
                "phone" => $request->get('phone'),
                "content" => $request->get('message'),
            ]);
            return response()->json($insertedData);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    protected function validator(array $data)
    {
        return Validator::make($data, [
            'name' => ['required', 'string', 'min:3', 'max:255'],
            'phone' => ['required', 'string'],
            'email' => ['required', 'string'],
            'message' => ['required', 'string'],
        ]);
    }

}
