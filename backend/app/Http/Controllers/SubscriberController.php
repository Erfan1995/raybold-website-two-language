<?php

namespace App\Http\Controllers;

use App\SubscriberModel;
use Illuminate\Http\Request;

class SubscriberController extends Controller
{
    //

    public function storeSubscriber(Request $request)
    {
        try {
            $insertedData = SubscriberModel::create([
                'email' => $request->get('email')
            ]);
            return response()->json($insertedData);

        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage()
            ], 500);
        }
    }
}
