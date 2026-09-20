import React, { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Home,
  RefreshCw,
  Zap,
} from "lucide-react";
import { NavLink } from "react-router";

function Admin() {
  const [selectedOption, setSelectedOption] = useState(null);

  const adminOptions = [
    {
      id: "create",
      title: "Create Problem",
      description: "Add a new coding problem to the platform",
      icon: Plus,
      color: "btn-primary",
      bgColor: "bg-lime-300/10",
      route: "/admin/create",
    },

    {
      id: "update",
      title: "Update Problem",
      description: "Edit existing problems and their details",
      icon: Edit,
      color: "btn-primary",
      bgColor: "bg-lime-300/10",
      route: "/admin/update",
    },

    {
      id: "delete",
      title: "Delete Problem",
      description: "Remove problems from the platform",
      icon: Trash2,
      color: "btn-primary",
      bgColor: "bg-lime-300/10",
      route: "/admin/delete",
    },
  ];

  return (
    <div className="min-h-screen bg-[#090d0b] text-slate-100">

      <div className="container mx-auto px-4 py-8">

        {/* HEADER */}

        <div className="text-center mb-12">

          <h1 className="text-4xl font-bold tracking-tight text-slate-100 mb-4">
            Admin Panel
          </h1>

          <p className="text-slate-400 text-lg">
            Manage coding problems on your platform
          </p>

        </div>

        {/* ADMIN OPTIONS GRID */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">

          {adminOptions.map((option) => {

            const IconComponent = option.icon;

            return (
              <div
                key={option.id}
                className="card border border-slate-800 bg-[#111610] shadow-xl shadow-black/20 hover:border-lime-300/30 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >

                <div className="card-body items-center text-center p-8">

                  {/* ICON */}

                  <div
                    className={`${option.bgColor} p-4 rounded-full mb-4`}
                  >
                    <IconComponent
                      size={32}
                      className="text-[#c8ff3d]"
                    />
                  </div>

                  {/* TITLE */}

                  <h2 className="card-title text-xl text-slate-100 mb-2">
                    {option.title}
                  </h2>

                  {/* DESCRIPTION */}

                  <p className="text-slate-400 mb-6">
                    {option.description}
                  </p>

                  {/* ACTION BUTTON */}

                  <div className="card-actions">

                    <div className="card-actions">

                      <NavLink
                        to={option.route}
                        className={`btn ${option.color} btn-wide`}
                      >
                        {option.title}
                      </NavLink>

                    </div>

                  </div>

                </div>

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
}

export default Admin;
