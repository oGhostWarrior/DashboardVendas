<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeder.
     *
     * @return void
     */
    public function run()
    {
        // Administrador padrão
        User::create([
            'name' => 'Administrador',
            'email' => 'admin@axon.com',
            'password' => Hash::make('admin123'),
            'role' => 'administrador',
            'active' => true,
        ]);

        // Gerente padrão
        User::create([
            'name' => 'Gerente',
            'email' => 'gerente@axon.com',
            'password' => Hash::make('gerente123'),
            'role' => 'gerente',
            'active' => true,
        ]);

        // Vendedor padrão
        User::create([
            'name' => 'Vendedor',
            'email' => 'vendedor@axon.com',
            'password' => Hash::make('vendedor123'),
            'role' => 'vendedor',
            'active' => true,
        ]);
    }
}